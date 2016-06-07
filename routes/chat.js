var mongoose = require('mongoose');


exports.delete = function(req, res) {
    mongoose.model('Posts')
        .remove({
            _id: req.body.postID
        }, function(data) {
            res.json({
                succ: "It worked"
            });
        });
}

exports.view = function(req, res) {
    if (req.user) {
        mongoose.model('Posts').find({}).sort({
            timeSinceE: -1
        }).exec(function(err, posts) {
            for (var i = 0; i < posts.length; i++) {
                if (posts[i].user.username == req.user.username) {
                    posts[i].sameUser = true;
                }
                posts[i].numOfComments = posts[i].comments.length
            }
            if (err) {

            } else {

                res.json({
                    'newsfeed': posts
                });
            }
        })
    } else {
        res.redirect("/");
    }
};