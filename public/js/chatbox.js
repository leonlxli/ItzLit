var socket = io();
var xhttp = new XMLHttpRequest();

var postarry = [];
var data;
var index = 0;
var limit = 0;

$(document).ready(function() {
    $.get('/chat',
    function(dat) {
        console.log(dat)
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
    console.log("Before")
    if (index < data.newsfeed.length) {
        limit += 10;
        console.log("in")
        $('#messages').empty();
        console.log("before");
        console.log(index);
        var i = 0;
        index = 0;
        while (i < limit && i < data.newsfeed.length) {
            $('#messages').append($('<div>').html(messageTemplate(data.newsfeed[index])));
            console.log("INSIDE PLACE POSTS OF CHATBOX: "+ data.newsfeed[index]);
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


function deletePostModal(postID) {
    console.log("test");
    $('#modal' + postID).openModal();
}

function deletePost(postID) {
    $.post('/chat/delete', {
        postID: postID,
    }, function(dat, succ) {
        if (dat.succ) {
            for (var i = 0; i < data.newsfeed.length; i++) {
                console.log("helooooo");
                if (data.newsfeed[i]._id == postID) {
                    console.log(i);
                    console.log(postID)
                    console.log(data.newsfeed[i]._id)
                    data.newsfeed.splice(i, 1);
                    console.log(postID)
                    console.log(data.newsfeed[i]._id)
                }
            }
            $("#post" + postID).remove();
        }
    })
}


function gymChange(e) {

    // var data = new FormData();
    // window.location.href = url;
    // data.append('gym', gym);
    $.get('/chat',
    function(dat) {
        console.log(dat);
        $('#messages').empty();
        data = dat;
        placePosts();
    });
}

// $(".comments").click(function() {
//     var postID = $(this).attr("postID");
//     $.get('/comments', {
//         postID: postID
//     }, function(html, succ){
//         //
//     });

// });

function messageTemplate(template) {
    /*var result =
        '<div class="row center-block" id="post{{_id}}">' +
        '<div class="col s12">' +
        '<div class="card white">' +
        '<div class="card-content black-text">' +
        '<img src="' + template.user.photo + '" />' +
        '<p><b>' + template.user.username + '</b> posted on ' + template.posted + ':</p>' +
        '<div class="card-title">' +
        '<h2>' + template.message + '</h2>' +
        '<p><i>' + template.gym + '</i></p>' +
        '</div>' +
        '</div>' +
        '<div class="card-action">' +
        '<a href="/comments?postID={{_id}}" class="btn blue darken-3 left comments" postID="{{_id}}">' + template.comments.length + ' comments</a>' +
        '<div class="delete" sameUser="' + template.sameUser + '" postID="{{_id}}">' +
        '</div>' +
        '</div>' +
        '<br>' +
        '<br />' +
        '<div id="modal{{_id}}" class="modal">' +
        '<div class="modal-content">' +
        '<h4>Delete post?</h4>' +
        '<p>Are you sure you want to delete this post? Click "DELETE" below to delete this post or cancel to go back.</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<a class="modal-action modal-close btn blue darken-3 right" href="#" rel="nofollow">DELETE</a>' +
        '<a class="modal-action modal-close btn blue darken-3 left">CANCEL</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';*/
        console.log(template);
    var result =
        '<div class="row center-block" id="post' + template._id + '">' +
        '<div class="col s10 offset-s1">' +
        '<div class="card white">' +
        '<div class="card-content black-text">' +
        // '<img style="vertical-align:middle;" src="' + template.user.photo + '" />' +
        '<b>  ' + template.user + '</b><span class="username"> posted about <a class="blue-text"><i>' + template.posted + ':</p></span>' +
        '<div class="card-title">' +
        '<p>' + template.message + '</p>' +
        '</div>' +
        '</div>' +
        '<div class="card-action">' +
        '<a href="/comments?postID=' + template._id + '" class="btn blue darken-3 left comments" postID="' + template._id + '">' + template.comments.length + ' comments</a>' +
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


    // $('.comment_form').submit(function(e) {

    //     e.preventDefault();
    //     var parent_post_id = $(this).attr("parent")
    //     console.log("hi");
    //     // console.log(parent_post_id);
    //     var $comment = $('#comment_'+parent_post_id);
    //     socket.emit('newComment', {
    //         "parent_post_id": parent_post_id,
    //         "comment": $comment.val()
    //     });
    //     $comment.val('');
    // })


    socket.on('online', function(data) {
        // $('#usersOnline').html(data.online);
    });

    socket.on('newsfeed', function(datem) {
        console.log("socket=======");
        if ($("#newMessages").children().length == 0) {
            var dat = JSON.parse(datem);
            console.log(data.newsfeed[0])
            console.log(dat);
            data.newsfeed.unshift(dat.post);
            index = 0;
            limit = limit - 10;
            $('#newMessages').append($('<div id="messBtn" class= "col s10 offset-s1">').html('<a id="newMessage" class="btn blue darken-3 row center-block" onclick="addPosts()">Load new posts</a>'));
            document.title = "TRITONED (new)";
        }

    });
})($);
