//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var pg = require('pg');
var app = express();
var jsonfile = require('jsonfile');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var models = require("./models");
var mongoose = require('mongoose');

//client id and client secret here, taken from .env (which you need to create)
dotenv.load();
var d = new Date();
var n = d.getTime();
// console.log(n)
// request("http://api.spotcrime.com/crimes.json?lat=32.713006&lon=-117.160776&radius=5.00&callback=jQuery21307676314746535686_1462858455579&key=.&_=" + n, function(error, response, body) {
//     console.log(typeof(body))
//         // console.log(body)
//     var i = body.indexOf('{')
//     var data = JSON.parse(body.substring(i, body.length - 1));
//     console.log(data)
//         // for(var i = 0; i<body.length;i++)
// });

//connect to database
var conString = process.env.DATABASE_CONNECTION_URL;

//Configures the Template engine
app.engine('html', handlebars({
    defaultLayout: 'layout',
    extname: '.html'
}));
app.set("view engine", "html");
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback",
  },
  function(accessToken, refreshToken, profile, done) {

      console.log(profile.displayName);
      // What goes here? Refer to step 4.
      models.User.findOne({ "facebookID": profile.id }, function(err, user) {
      // (1) Check if there is an error. If so, return done(err);
      console.log("ENTERING HERE")
      if(err) {
          return done(err);
      }
      if(!user) {
          // (2) since the user is not found, create new user.
          // Refer to Assignment 0 to how create a new instance of a model
          console.log("here1")
          var newUser = new models.User({
              "facebookID": profile.id,
              "token": accesstoken,
              "name": profile.displayName
          });
          newUser.save();
          return done(null, profile);
      } else {
        console.log("here2")
          // (3) since the user is found, update user’s information
          process.nextTick(function() {
              user.facebookID = profile.id;
              user.token = token;
              user.name = profile.displayName;
              user.save();
              return done(null, profile);
          });
      }
    });
  }));



var router = {
    // uberData: require("./routes/uberData"),
    myData: require("./routes/myData")
        // invalid: require("./routes/invalid")
};
const query = "select charge_description, activity_date, block_address, community, zip " +
    "from cogs121_16_raw.arjis_crimes " +
    "where zip IS NOT NULL AND community IS NOT NULL AND charge_description IS NOT NULL AND " +
    "NULLIF(zip, '') IS NOT NULL AND NULLIF(community, '') IS NOT NULL AND NULLIF(charge_description, '') IS NOT NULL AND" +
    "community NOT LIKE 'UNKNOWN' LIMIT 10000;";
//set environment ports and start application
app.set('port', process.env.PORT || 3000);

/* Passport serialization here */
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

//routes
// routes for oauth using Passport
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/', function(req, res) {
    res.render('index');
});
app.get('/lights', router.myData.getLights);
app.get('/crimes', router.myData.getCrimes);
app.get('/directions', router.myData.getDirections);

app.get('/currentCrimes', router.myData.getCurrentCrimes);


app.all('*', function(req, res) {
    res.redirect('/invalid');
});



http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
