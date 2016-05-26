var socket = io();

var posted = false;

socket.on('comment', function(data) {
    console.log("socket=======");
    var dat = JSON.parse(data);
    if (dat.postID == $('#comment_content').attr("parent")) {
        if (posted) {
            addComments();
            posted = false;
        } else if($("#commentBtnContainer").children().length == 0) {
            $('#commentBtnContainer').append($('<div id="cmtBtn">').html('<a id="loadComments" class="btn blue darken-3 row center-block" onclick="addComments()">Load new posts</a>'));
        }
    }

});

function addComments() {
    var postID = $("#originalPost").attr("postID");
    $.get('/comments/get', {
        post_id: postID
    }, function(data) {
        $("#comments").empty();
        var comments = data.comments;
        renderComments(comments);
    });
}

function renderComments(comments) {
    for (var i = 0; i < comments.length; i++) {
        $('#comments').append($('<li>').html(messageTemplate(comments[i])));
    }
    $('#commentBtnContainer').empty();
}

function messageTemplate(template) {
    console.log(template);
    var result =
        '<li class="card blue lighten-4" id="comment' + template.commentID + '">' +
        '<div class="card-content black-text">' +
        '<div class="user">' +
        '<div class="user-image">' +
        '<img src="' + template.photo + '" alt="" style="vertical-align: middle; padding-right: 3px;">' +
        '<b>' + template.user.username + '</b><span class="username"> posted on </span>' +
        '<span class="posted">' + template.posted + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="message-content">' +
        '<h5><blockquote style="border-color: #1565C0;">' + template.message + '</blockquote></h5>' +
        '</div>' +
        '<div class="delete" sameUser="true" commentID="' + template.commentID + '">' +
        '<button class="btn blue darken-3 white-text right" href="#" onclick="deleteCommentModal(\'' + template.commentID + '\')">delete</a>' +
        '</div>' +
        '<br>' +
        '<br>' +
        '<div id="modal' + template.commentID + '" class = "modal">' +
        '<div class="modal-content">' +
        '<h4>Delete post?</h4>' +
        '<p>Are you sure you want to delete this post? Click "DELETE" below to delete this post or cancel to go back.</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<a class="modal-action modal-close btn blue darken-3 right delBtn" commentID="' + template.commentID + '" onclick="deleteComment(\'' + template.commentID + '\')" rel="nofollow" style="margin-left:20px">DELETE</a>' +
        '<a class="modal-action modal-close btn grey lighten-1 right">CANCEL</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</li>';
    return result;
}



function deleteComment(commentID) {
    var postID = $("#originalPost").attr("postID");
    $.post('/comments/delete', {
        postID: postID,
        commentID: commentID
    }, function(data, succ) {
        if (data.succ) {
            $("#comment" + commentID).remove();
        }
    })
}

function deleteCommentModal(commentID) {
    $('#modal' + commentID).openModal();

}

$('#send_comment').submit(function(e) {
    e.preventDefault();

    var comment_content = $('#comment_content').val();
    var original_postID = $('#comment_content').attr("parent");
    $.post('/comments', {
        comment: comment_content,
        post_id: original_postID
    }, function(my_comment) {
        posted = true;
        var dat = {
            postID: original_postID,
            comment: my_comment
        };
        console.log(dat);
        socket.emit('comment', dat);
        $('#comment_content').val('');
    });
    // $user_input.val('');
})

$(document).ready(function() {
    putDeleteButtons();
});

function putDeleteButtons() {
    var deleteButtonArray = $('.delete');
    console.log(deleteButtonArray);
    for (var i = 0; i < deleteButtonArray.length; i++) {
        if ($(deleteButtonArray[i]).attr("sameUser") == "true") {
            var commentID = $(deleteButtonArray[i]).attr("commentID");
            console.log(commentID);
            $(deleteButtonArray[i]).append(
                '<button class="btn blue darken-3 white-text right" href="#" onclick="deleteCommentModal(\'' + commentID + '\')">delete</a>'
            );
        }
    }
}

var modal = document.getElementById('myModal');
var errmodalmsg = document.getElementById('errModalmsg');

// Get the button that opens the modal
var btn = document.getElementById("submitnewcomment");
// Get the elements that closes the modal
var span = document.getElementsByClassName("cancelBtn")[0];
var postBtn = document.getElementById("submitBtn");
var okBtn2 = document.getElementById("okBtn2");

// When the user clicks on the button, open the modal
btn.onclick = function() {
        var message = $('#comment_content').val();

        if (message == "") {
            errmodalmsg.style.display = "block";
        } else {
            $('#postMessage').append("'" + message + "'?");
            modal.style.display = "block";
        }

    }
    // When the user clicks on <span> (x), close the modal
span.onclick = function() {
    $('#postMessage').text("Are you sure you want to post: ");
    modal.style.display = "none";
}
okBtn2.onclick = function() {
    console.log("ok button pressed");
    errmodalmsg.style.display = "none";
}
postBtn.onclick = function() {
    console.log("ok button pressed");
    modal.style.display = "none";
}
