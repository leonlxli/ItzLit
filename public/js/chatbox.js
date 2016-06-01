var socket = io();
var xhttp = new XMLHttpRequest();

var postarry = [];
var data;
var index = 0;
var limit = 0;

/*
var commentModal =
    '<div id="commentsModal" data-toggle="modal" class="modal fade" role="dialog">' +
        '<div class="modal-dialog">' +
            '<!-- Modal content-->' +
            '<div class="modal-content">' +
                '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                    '<h4 class="modal-title">Comments</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<div class="card">' +
                        '<div class="card-content black-text">' +
                            '<div class="user">' +
                                '<div class="user-image">' +
                                    // <img src="{{user.photo}}" alt="" style="vertical-align: middle;">
                                    '<b>{{user}}</b><span class="username"> posted</span>'
                                    '<span class="posted">{{posted}}</span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="message-content" id="originalPost" postID="{{_id}}">' +
                                '<h2 class="black-text">{{message}}</h2>' +
                                '<br>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<ul id="comments">' +
                        '{{#each comments}}' +
                        '<li class="card blue lighten-4" id="comment{{_id}}">' +
                            '<div class="card-content black-text">' +
                                '<div class="user">' +
                                    '<div class="user-image">' +
                                        // <img src="{{photo}}" alt="" style="vertical-align: middle;">
                                        '<b>{{user}}</b><span class="username"> posted on </span>' +
                                        '<span class="posted">{{posted}}</span>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="message-content">' +
                                    '<blockquote style="border-color: #1565C0;"><h5>{{message}}</h5></blockquote>' +
                                '</div>' +
                                '<div class="delete" sameUser="{{sameUser}}" commentID="{{_id}}">' +
                                '</div>'
                                '<br>'
                                '<br>'
                                '<div id="modal{{_id}}" class="modal">' +
                                    '<div class="modal-content">' +
                                        '<h4>Delete post?</h4>' +
                                        '<p>Are you sure you want to delete this post? Click "DELETE" below to delete this post or cancel to go back.</p>' +
                                    '</div>' +
                                    '<div class="modal-footer">' +
                                        '<!--a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Agree</a-->' +
                                        '<a class="modal-action modal-close btn blue darken-3 right delBtn" commentID="{{_id}}" onclick="deleteComment("{{_id}}")" rel="nofollow" style="margin-left:20px">DELETE</a>' +
                                        '<a class="modal-action modal-close btn grey lighten-1 right">CANCEL</a>' +
                                    '</div>' +
                                '</div>'+
                            '</div>'+
                        '</li>'+
                        '{{/each}}'+
                    '</ul>'+
                    '<div id="commentBtnContainer" class="center center-block">'+
                    '</div>'+
                    '<form id="send_comment" action="#" class="center center-block">'+
                        '<div>'+
                            '<h5 class="white-text">Type up a comment here:<h5></div>'+
                '<textarea id="comment_content" class="white-text text-darken-4 container" placeholder="Type a new comment and click "Post Comment"!" autocomplete="off" parent="{{_id}}" required></textarea>' +
                '</div>'+
                '<div id="myModal" class = "modal" style="z-index:9999; top:20%;">' +
                  '  <div class="modal-content" style="padding:10px;">'+
                        '<h4 align="left">Submit Post?</h4>'+
                      '  <p id="postMessage">Are you sure you want to post: </p>'+
                        '<input class="modal-action modal-close btn blue darken-3 right subBtn" id="submitBtn" type="submit" value="Post" rel="nofollow" style="margin-left:20px">' +
                        '<a class="modal-action modal-close btn grey lighten-1 right cancelBtn">CANCEL</a>' +
                    '</div>' +
                '</div>' +

                '<div id="errModalmsg" class = "modal" style="z-index:9999; top:20%;">' +
                    '<div class="modal-content" style="padding:10px;">' +
                        '<h4 align="left">Empty post.</h4>' +
                        '<p>You must enter a message in order to post.</p>'+
                        '<a class="modal-action modal-close btn blue darken-3 right" id="okBtn2">OK</a>'+
                    '</div>'+
                '</div>'+

            '</form>'+
                '<center>'+
                '<br />'+
                '<Button id="submitnewcomment" class="btn-large">Post Comment</Button>'+
                '<center>'+
            '</div>'+
        '</div>'+
    '</div>';
    */

function showRoutes() {
    console.log("routes")
    $("#routeInfoDiv").css("display", "block")
    $("#postsDiv").css("display", "none")
}

function showFeed() {
    console.log("feed")
    $("#routeInfoDiv").css("display", "none")
    $("#postsDiv").css("display", "block")
}
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
        //$('#commentStuff').append($('<div>').html(commentModal));
        while (i < limit && i < data.newsfeed.length) {

            $('#messages').append($('<div>').html(messageTemplate(data.newsfeed[index])));
            console.log("INSIDE PLACE POSTS OF CHATBOX: " + JSON.stringify(data.newsfeed[index]));
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
    console.log("HEY IM IN CHATBOX.JS DIS IS THE TEMPLATE: " + JSON.stringify(template));
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
    var result =
        '<div class="row" id="post' + template._id + '" style="padding-top:20px;">' +
        '<div class="col s10 offset-s1">' +
        '<div class="card white">' +
        '<div class="card-content black-text" style="color:black;">' +
        // '<img style="vertical-align:middle;" src="' + template.user.photo + '" />' +
        '<b>  ' + template.user.username + '</b><span class="username"> posted at <i>' + template.posted + ':</i></p></span>' +
        '<div class="card-title center-block">' +
        '<p>' + template.message + '</p>' +
        '</div>' +
        '</div>' +
        '<div class="card-action">' +
        //'<a href="/comments?postID=' + template._id + '" class="btn comments" postID="' + template._id + '">' + template.comments.length + ' comments</a>' +
        //'<a href="#commentsModal" data-toggle="modal"> ' + template.comments.length + ' comments</a>' +
        '<a href="#commentsModal" data-toggle="modal" class="btn comments" postID="' + template._id + '">' + template.comments.length + ' comments</a>' +
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
btn.onclick = function() {
        console.log("submit new comment clicked");

        var message = $('#comment_content').val();

        if (message == "") {
            errmodalmsg2.style.display = "block";
        } else {
            $('#postMessage').append("'" + message + "'?");
            comSubPost.style.display = "block";
        }

    }
    // When the user clicks on <span> (x), close the modal
span.onclick = function() {
    $('#postMessage').text("Are you sure you want to post: ");
    comSubPost.style.display = "none";
}
okBtn3.onclick = function() {
    console.log("ok button pressed");
    errmodalmsg2.style.display = "none";
}
postBtn.onclick = function() {
    console.log("post button pressed");
    comSubPost.style.display = "none";
}

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