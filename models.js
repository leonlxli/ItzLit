var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    "facebookID": String,
    "token": String,
    "name": String
});

exports.User = mongoose.model('User', UserSchema);
