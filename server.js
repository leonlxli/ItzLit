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
const MongoStore = require("connect-mongo")(session);


//client id and client secret here, taken from .env (which you need to create)

dotenv.load();
var d = new Date();
var n = d.getTime();

var parser = {
    body: require("body-parser"),
    cookie: require("cookie-parser")
};

var db = mongoose.connection;
console.log(process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/cogs121');

db.on('error', console.error.bind(console, 'Mongo DB Connection Error:'));
db.once('open', function(callback) {
    console.log("Database connected successfully.");
});


// session middleware
var session_middleware = session({
    key: "session",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        mongooseConnection: db
    })
});
app.use(session_middleware);

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
app.use(parser.body.json());
app.use(require('method-override')());
app.use(session_middleware);
app.use(passport.initialize());
app.use(passport.session());

// facebook
passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "/auth/facebook/callback",
    },
    function(accessToken, refreshToken, profile, done) {
        // What goes here? Refer to step 4.
        models.User.findOne({
            facebookID: profile.id
        }, function(err, user) {
            // (1) Check if there is an error. If so, return done(err);
            if (err) {
                return done(err);
            }
            if (!user) {
                // (2) since the user is not found, create new user.
                // Refer to Assignment 0 to how create a new instance of a model
                var newUser = new models.User({
                    "facebookID": profile.id,
                    "token": accessToken,
                    "name": profile.displayName
                });
                newUser.save();
                return done(null, profile);
            } else {
              console.log(user);
                process.nextTick(function() {
                    user.facebookID = profile.id;
                    user.token = accessToken;
                    user.name = profile.displayName;
                    user.save();
                    return done(null, profile);
                });
            }
        });
    }));



var router = {
    // uberData: require("./routes/uberData"),
    myData: require("./routes/myData"),
    index: require("./routes/index")
        // invalid: require("./routes/invalid")
};
const query = "select charge_description, activity_date, block_address, community, zip " +
    "from cogs121_16_raw.arjis_crimes " +
    "where zip IS NOT NULL AND community IS NOT NULL AND charge_description IS NOT NULL AND " +
    "NULLIF(zip, '') IS NOT NULL AND NULLIF(community, '') IS NOT NULL AND NULLIF(charge_description, '') IS NOT NULL AND" +
    "community NOT LIKE 'UNKNOWN' LIMIT 10000;";
//set environment ports and start application
app.set('port', process.env.PORT || 8050);

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
        successRedirect: '/destinations',
        failureRedirect: '/'
    }),
    function(req, res) {
        console.log("success")
            // Successful authentication, redirect home.
        res.redirect('/');
    });

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/maps', function(req, res) {
    res.render('maps');
});
app.get('/forum', function(req, res) {
    res.render('forum');
});
app.get('/destinations', function(req, res) {
    res.render('destinations');
});
app.get('/lights', router.myData.getLights);
app.get('/crimes', router.myData.getCrimes);
// app.get('/directions', router.myData.getDirections);

app.get('/currentCrimes', router.myData.getCurrentCrimes);

app.get('/getAllCrimeData', router.index.getAllCrimeData);
app.get('/getTimeCrimeData', router.index.getTimeCrimeData);
app.get('/getTimeTypeCrimeData', router.index.getTimeTypeCrimeData);
app.get('/getTimeBarCrimeData', router.index.getTimeBarCrimeData);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
