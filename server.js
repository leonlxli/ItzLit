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


var request = require("request");

//client id and client secret here, taken from .env (which you need to create)
dotenv.load();

request("http://api.spotcrime.com/crimes.json?lat=32.713006&lon=-117.160776&radius=0.02&callback=jQuery21307676314746535686_1462858455579&key=.&_=1462858455582", function(error, response, body) {
    console.log(body)
});

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

//routes
app.get('/', function(req, res) {
    res.render('index');
});
app.get('/lights', router.myData.getLights);
app.get('/crimes', router.myData.getCrimes);
app.get('/currentCrimes', function(req, res) {
        request("http://api.spotcrime.com/crimes.json?lat=32.713006&lon=-117.160776&radius=0.02&callback=jQuery21307676314746535686_1462858455579&key=.&_=1462858455582", function(error, response, body) {
            if (!error) {
                res.json(body)
            } else {
                res.json({
                    error: "GG it doesn't work anymore"
                })
            }
        });
    })
    // app.get('/invalid', function(req, res) {
    //     res.render('invalid');
    // });

app.all('*', function(req, res) {
    res.redirect('/invalid');
});



http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});