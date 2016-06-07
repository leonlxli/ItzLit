var socket = io();
var xhttp = new XMLHttpRequest();

var postarry = [];
var data;
var index = 0;
var limit = 0;

function showRoutes() {
    $("#routeInfoDiv").css("display", "block")
    $("#postsDiv").css("display", "none")
    $("#routeTabs").css("background-color", "#DEDFE6")
    $("#feedTab").css("background-color", "#F8F9FA")

}

function showFeed() {
    $("#routeInfoDiv").css("display", "none")
    $("#postsDiv").css("display", "block")
    $("#feedTab").css("background-color", "#DEDFE6")
    $("#routeTabs").css("background-color", "#F8F9FA")


}
$(document).ready(function() {
    $.get('/chat',
        function(dat) {
            data = dat;
            placePosts();
        });

    appendButton();
    formatComments();
    $("#all").addClass("selected");

});


function formatComments() {
    var comments = $('.comments');
    for (var i = 0; i < comments.length; i++) {
        var numOfComments = $(comments[i]).attr("value");
        if (numOfComments == 1) {
            $(comments[i]).html(numOfComments + ' comment')
        } else {
            $(comments[i]).html(numOfComments + ' comments')
        }
    }
}

function appendButton() {

    var deleteButtonArray = $('.delete');
    for (var i = 0; i < deleteButtonArray.length; i++) {
        if ($(deleteButtonArray[i]).attr("sameUser") == "true") {
            var postID = $(deleteButtonArray[i]).attr("postID");
            /*$(deleteButtonArray[i]).append('<button value="Delete" postID=' +
                postID +
                '>Delete</button>');*/
            $(deleteButtonArray[i]).append(
                '<button class="btn blue darken-3 white-text right" href="#" onclick="deletePostModal(\'' + postID + '\')" postID=' +
                postID +
                '>delete</a>'
            );
        }

    }
}

function placePosts() {
    if (index < data.newsfeed.length) {
        limit += 10;
        $('#messages').empty();
        var i = 0;
        index = 0;
        //$('#commentStuff').append($('<div>').html(commentModal));
        while (i < limit && i < data.newsfeed.length) {

            $('#messages').append($('<div>').html(messageTemplate(data.newsfeed[index])));
            index++;
            i++;
        }
        if (index == limit && $('#LoadMore').children().length == 0) {
            $('#LoadMore').append($('<div id="loadMore" class= "col s10 offset-s1">').html('<a id="loadMoreBtn" class="btn blue darken-3 row center-block" onclick="placePosts()">Load older posts</a>'));
        }
        if (index == data.newsfeed.length) {
            $('#LoadMore').empty();
        }

        appendButton();
        $('#newMessages').empty();
        document.title = "ITZ LIT";
    }
}

function addPosts() {
    $.get('/chat', function(data) {
        placePosts(data);
    });
}



function messageTemplate(template) {

    var newDate = template.posted.replace(", 2016", "");
    var result =
        '<div class="row" id="post' + template._id + '" style="padding-top:5px;">' +
        '<div class="col s10 offset-s1">' +
        '<div class="card white">' +
        '<div class="card-content black-text" style="color:black;text-align:left;">' +
        '<div id="postHeaders"><div style="float:left;width:16%"><img style="vertical-align:middle;" src="' + template.user.photo + '" /></div>' +
        '<div style="width:84%; float:right" id = "userInfoHeader"><b>  ' + template.user.username + '</b> posted <i>' + newDate + '</i><br><img src="../images/place.png"> <i>' + template.location + ':</i></div></div>' +
        '<div class="card-title center-block">' +
        '<div class="message" style="padding-left: 10px;display:inline:block; text-align:left"><p>&nbsp</p><p>' + template.message + '</p></div>' +
        '</div>' +
        '</div><hr>' +
        '<div class="card-action">' +
        '<div class="delete" sameUser="' + template.sameUser + '" postID="' + template._id + '">' +
        '</div>' +
        '</div>' +
        '<br>' +
        '<div id="modal' + template._id + '" class="modal">' +
        '<div class="modal-content">' +
        '<h4>Delete post?</h4>' +
        '<p>Are you sure you want to delete this post? Click "DELETE" below to delete this post or cancel to go back.</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<a class="modal-action modal-close btn blue darken-3 right delBtn" postID="' + template._id + '" onclick="deletePost(\'' + template._id + '\')" rel="nofollow" style="margin-left:40px">DELETE</a>&nbsp;&nbsp;&nbsp;' +
        '<a class="modal-action modal-close btn grey lighten-1 right">CANCEL</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    return result;
}

(function($) {

    "use strict";

    $('#send_message').submit(function(e) {
        e.preventDefault();
        var $user_input = $('#user_input')
        socket.emit('newsfeed', $user_input.val());
        // $user_input.val('');
    })

    socket.on('online', function(data) {
        // $('#usersOnline').html(data.online);
    });

    socket.on('newsfeed', function(datem) {
        if ($("#newMessages").children().length == 0) {
            var dat = JSON.parse(datem);
            data.newsfeed.unshift(dat.post);
            index = 0;
            limit = limit - 10;
            $('#newMessages').append($('<div id="messBtn" class= "col s10 offset-s1">').html('<a id="newMessage" class="btn blue darken-3 row center-block" onclick="addPosts()">Load new posts</a>'));
            $('#newMessage').click();
            $('#message_content').val('');
            document.title = "TRITONED (new)";
        }

    });
})($);


var comSubPost = document.getElementById('comSubPost');
var errmodalmsg2 = document.getElementById('errModalmsg2');

// Get the button that opens the modal
var btn = document.getElementById("submitnewcomment");
// Get the elements that closes the modal
var span = document.getElementsByClassName("cancelBtn2")[0];
var postBtn = document.getElementById("submitBtn2");
var okBtn3 = document.getElementById("okBtn3");

// When the user clicks on the button, open the modal

// When the user clicks on <span> (x), close the modal

$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) { // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200); // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200); // Else fade out the arrow
    }
});

$('#return-to-top').click(function() { // When arrow is clicked
    $('body,html').animate({
        scrollTop: 0 // Scroll to top of body
    }, 500);
})