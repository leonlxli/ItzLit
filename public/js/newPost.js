var socket = io();

function redirect() {
    console.log('redirecting...');
    window.location.href = '/maps';
}

(function($) {
    "use strict";

    $('#send_post').submit(function(e) {
        e.preventDefault();
    })
})($);


// Get the modal
var modal = document.getElementById('submitModal');
var errmodal = document.getElementById('errModal');
var errmodalmsg = document.getElementById('errModalmsg');
// Get the button that opens the modal
var btn = document.getElementById("submitnewpost");
// Get the elements that closes the modal
var span = document.getElementsByClassName("cancelBtn")[0];
var okBtn = document.getElementById("okBtn");
var okBtn2 = document.getElementById("okBtn2");
// When the user clicks on the button, open the modal
btn.onclick = function(e) {
    checkDat();
}
    // When the user clicks on <span> (x), close the modal
span.onclick = function() {
    $('#postMessage').text("Are you sure you want to post: ");
    modal.style.display = "none";
}
okBtn.onclick = function() {
    console.log("ok button pressed");
    errmodal.style.display = "none";
}
okBtn2.onclick = function() {
    console.log("ok button pressed");
    errmodalmsg.style.display = "none";
}

function checkEnter(e){
 e = e || event;
 var txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
 return txtArea || (e.keyCode || e.which || e.charCode || 0) !== 13;
}

document.querySelector('form').onkeypress = checkEnter;


function checkDat() {

  var str = $('#loc').val().toLowerCase();

  if (str.indexOf('ucsd') == -1 && str.indexOf('diego') == -1 && str.indexOf('jolla') == -1) {
    console.log("return true")
    console.log(str.indexOf('ucsd'))
    $('#locErr').text('Your location must be in San Diego!');
  }
  else {
    $('#locErr').text('');

    var message = $('#message_content').val();

    if (message != "") {
        $('#postMessage').append("'" + message + "'?");
        modal.style.display = "block";
    } else {
        errmodalmsg.style.display = "block";
    }
  }
}

function submitDat() {
  console.log("sendingggggg");
  var message = $('#message_content').val();
  var location = $('#loc').val();
  location = location.substring(0, location.indexOf(','));
  $.post('/newPost', {
      message: message,
      location: location
  }, function(data, success) {
      $('#loc').val('');
      console.log("I'm emitting")
      console.log(data)
      socket.emit('newsfeed', data);
      $('.cancelBtn').click();
      $('.close').click();
  });
}
