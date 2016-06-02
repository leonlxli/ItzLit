var models = require('../models');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
const express = require("express");
 const app = express();

const http = require("http").createServer(app);

var socket = require('socket.io')(http);


exports.view = function(req, res) {
    if (req.user) {
        res.render("newPost", {
            'profPic': req.user._json.profile_image_url
        });
    } else {
        res.redirect("/");
    }
};

exports.post = function(req, res) {
    var now = new Date();
    var seconds = now.getTime()/1000;
    var date = dateFormat(now, "h:MM TT, dddd, mmmm dS, yyyy");
    if (req.user) {
        var newPost = new models.Posts({
            'timeSinceE':seconds,
            'message': req.body.message,
            'location': req.body.location,
            'user': {
                'username': req.user.displayName,
                'photo': req.user.photos[0].value
            },
            'posted': date,
            'comments': [],
        });
        newPost.save(function(err, suc) {
            if (err) {
                res.json({
                    'user': req.user,
                    'error': err
                })
            } else {
                res.json({
                    'post': suc
                })
            }
        })
    } else {
        res.json({
            'error': 'Not logged in'
        })
    }
}
