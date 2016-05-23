# Copyright 2014 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Utility library for configuring access to the Google Container Registry.

Sets docker up to authenticate with the Google Container Registry using the
active gcloud credential.
"""

import base64
import errno
import json
import os
import sys
import tempfile
import urlparse

from googlecloudsdk.core import exceptions
from googlecloudsdk.core import log
from googlecloudsdk.core.credentials import store
from googlecloudsdk.core.util import files
from googlecloudsdk.core.util import platforms
from googlecloudsdk.third_party.py27 import py27_subprocess as subprocess

_USERNAME = 'oauth2accesstoken'
_EMAIL = 'not@val.id'


# Other tools like the python docker library (used by gcloud app)
# also rely on Docker's authorization configuration (in addition
# to the docker CLI client)
# NOTE: Lazy for manipulation of HOME / mocking.
def GetDockerConfig(force_new=False):
  """Retrieve the path to Docker's configuration file, noting its format.

  Args:
    force_new: bool, whether to force usage of the new config file regardless
               of whether it exists (for testing).

  Returns:
    The path to Docker's configuration file, and whether it is in the
    new configuration format.
  """
  # Starting in Docker 1.7.0, the Docker client moved where it writes
  # credentials to ~/.docker/config.json.  It is half backwards-compatible,
  # if the new file doesn't exist, it falls back on the old file.
  # if the new file exists, it IGNORES the old file.
  # This is a problem when a user has logged into another registry on 1.7.0
  # and then uses 'gcloud docker'.
  # This must remain compatible with: https://github.com/docker/docker-py
  new_path = os.path.join(platforms.GetHomePath(), '.docker', 'config.json')
  old_path = os.path.join(platforms.GetHomePath(), '.dockercfg')
  if os.path.exists(new_path) or force_new:
    return new_path, True
  return old_path, False


def _ReadFullDockerConfiguration():
  """Retrieve the full contents of the Docker configuration file.

  Returns:
    The full contents of the configuration file, and whether it
    is in the new configuration format.
  """
  path, new_format = GetDockerConfig()
  with open(path, 'r') as reader:
    return json.loads(reader.read()), new_format


def ReadDockerConfig():
  """Retrieve the contents of the Docker authorization entry.

  NOTE: This is public only to facilitate testing.

  Returns:
    The map of authorizations used by docker.
  """
  structure, new_format = _ReadFullDockerConfiguration()
  if new_format:
    return structure['auths'] if 'auths' in structure else {}
  else:
    return structure


def WriteDockerConfig(structure):
  """Write out a complete set of Docker authorization entries.

  This is public only to facilitate testing.

  Args:
    structure: The dict of authorization mappings to write to the
               Docker configuration file.
  """
  cfg, new_format = GetDockerConfig()
  if new_format:
    full_cfg, _ = _ReadFullDockerConfiguration()
    full_cfg['auths'] = structure
    contents = json.dumps(full_cfg, indent=2)
  else:
    contents = json.dumps(structure, indent=2)

  if platforms.OperatingSystem.Current() == platforms.OperatingSystem.WINDOWS:
    # On windows, there is no good way to atomically write this file.
    with files.OpenForWritingPrivate(cfg) as writer:
      writer.write(contents)
    return

  # This opens files with 0600, which are the correct permissions.
  with tempfile.NamedTemporaryFile(
      dir=os.path.dirname(cfg), delete=False) as tf:
    tf.write(contents)
    # This pattern atomically writes the file on non-Windows systems.
    os.rename(tf.name, cfg)


def UpdateDockerCredentials(server):
  """Updates the docker config to have fresh credentials.

  This reads the current contents of Docker's keyring, and extends it with
  a fresh entry for the provided 'server', based on the active gcloud
  credential.  If a credential exists for 'server' this replaces it.

  Args:
    server: The hostname of the registry for which we're freshening
       the credential.

  Raises:
    store.Error: There was an error loading the credentials.
  """
  # Loading credentials will ensure that we're logged in.
  # And prompt/abort to 'run gcloud auth login' otherwise.
  cred = store.Load()

  # Ensure our credential has a valid access token,
  # which has the full duration available.
  store.Refresh(cred)
  if not cred.access_token:
    raise exceptions.Error('No access token could be obtained '
                           'from the current credentials.')

  try:
    # Update the credentials stored by docker, passing the access token
    # as a password, and benign values as the email and username.
    _DockerLogin(server, _EMAIL, _USERNAME, cred.access_token)
  except exceptions.Error:
    # Fall back to the previous manual .dockercfg manipulation
    # in order to support gcloud app's docker-binaryless use case.
    # TODO(user) when app deploy is using Argo to take over builds,
    # remove this.
    _UpdateDockerConfig(server, _USERNAME, cred.access_token)
    log.warn(
        "'docker' was not discovered on the path. Credentials have been "
        "stored, but are not guaranteed to work with the 1.11 Docker client if"
        "an external credential store is configured.")


def _DockerLogin(server, email, username, access_token):
  """Register the username / token for the given server on Docker's keyring."""

  # Sanitize and normalize the server input.
  parsed_url = urlparse.urlparse(server)
  # Work around the fact that Python 2.6 does not properly
  # look for :// and simply splits on colon, so something
  # like 'gcr.io:1234' returns the scheme 'gcr.io'.
  if '://' not in server:
    # Server doesn't have a scheme, set it to HTTPS.
    parsed_url = urlparse.urlparse('https://' + server)
    if parsed_url.hostname == 'localhost':
      # Now that it parses, if the hostname is localhost switch to HTTP.
      parsed_url = urlparse.urlparse('http://' + server)

  server = parsed_url.geturl()

  # 'docker login' must be used due to the change introduced in
  # https://github.com/docker/docker/pull/20107 .
  # TODO(user) leverage https://github.com/docker/docker-py/issues/1023 when
  # Docker-py 1.9 is released.
  docker_args = ['login']
  docker_args.append('--email=' + email)
  docker_args.append('--username=' + username)
  docker_args.append('--password=' + access_token)
  docker_args.append(server)  # The auth endpoint must be the last argument.

  return Execute(docker_args)


def _UpdateDockerConfig(server, username, access_token):
  """Register the username / token for the given server on Docker's keyring."""

  # NOTE: using "docker login" doesn't work as they're quite strict on what
  # is allowed in username/password.
  try:
    dockercfg_contents = ReadDockerConfig()
  except IOError:
    # If the file doesn't exist, start with an empty map.
    dockercfg_contents = {}

  # Add the entry for our server.
  auth = base64.b64encode(username + ':' + access_token)

  # Sanitize and normalize the server input.
  parsed_url = urlparse.urlparse(server)
  # Work around the fact that Python 2.6 does not properly
  # look for :// and simply splits on colon, so something
  # like 'gcr.io:1234' returns the scheme 'gcr.io'.
  if '://' not in server:
    # Server doesn't have a scheme, set it to HTTPS.
    parsed_url = urlparse.urlparse('https://' + server)
    if parsed_url.hostname == 'localhost':
      # Now that it parses, if the hostname is localhost switch to HTTP.
      parsed_url = urlparse.urlparse('http://' + server)

  server = parsed_url.geturl()
  server_unqualified = parsed_url.hostname

  # Clear out any unqualified stale entry for this server
  if server_unqualified in dockercfg_contents:
    del dockercfg_contents[server_unqualified]

  dockercfg_contents[server] = {'auth': auth, 'email': _EMAIL}

  WriteDockerConfig(dockercfg_contents)


# Modeled after EnsureGit in workspaces.py
def EnsureDocker(func):
  """Wraps a function that uses subprocess to invoke docker.

  Rewrites OS Exceptions when not installed.

  Args:
    func: A function that uses subprocess to invoke docker.

  Returns:
    The decorated function.

  Raises:
    Error: Docker cannot be run.
  """
  def DockerFunc(*args, **kwargs):
    try:
      return func(*args, **kwargs)
    except OSError as e:
      if e.errno == errno.ENOENT:
        raise exceptions.Error('Docker is not installed.')
      else:
        raise
  return DockerFunc


@EnsureDocker
def Execute(args):
  """Wraps an invocation of the docker client with the specified CLI arguments.

  Args:
    args: The list of command-line arguments to docker.

  Returns:
    The exit code from Docker.
  """
  return subprocess.call(['docker'] + args,
                         stdin=sys.stdin,
                         stdout=sys.stdout,
                         stderr=sys.stderr)
