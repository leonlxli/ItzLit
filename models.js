var mongoose = require('mongoose');
var dateFormat = require('dateformat');

var UserSchema = new mongoose.Schema({
    "facebookID": String,
    "token": String,
    "name": String,
    "photo": String
});


var postSchema = mongoose.Schema({
    'sameUser': {
        type: Boolean,
        default: false
    },
    "timeSinceE": Number,
    'user': {
        'username': String,
        'photo': String
    },
    'message': String,
    'posted': String,
    'location': String,
    'lat': Number,
    'lng': Number,
    'comments': [{
        "timeSinceE": Number,
        'sameUser': {
            type: Boolean,
            default: false
        },
        'photo': String,
        'message': String,
        'username': String,
        'posted': String
    }],
    'numOfComments': Number,
    'notification': String
});

exports.User = mongoose.model('User', UserSchema);
exports.Posts = mongoose.model('Posts', postSchema);
