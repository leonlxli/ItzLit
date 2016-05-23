// var request = require("request");
var jsonp = require('jsonp')

exports.getCrimes = function(req, res) {
    var data = require('../crime_data.json')
    lights = data;
    res.json(data);
}

exports.getLights = function(req, res) {
    var data = require('../street_lights.json');
    var lightslatLng = [];

    for (dat in data.data) {
        var point = data.data[dat];
        lightslatLng.push([point.lat, point.lon]);
    }
    res.json({
        lights: lightslatLng
    });
}

exports.getCurrentCrimes = function(req, res) {
    var d = new Date();
    var n = d.getTime();
    // jsonp("http://api.spotcrime.com/crimes.json?lat=" + req.query.lat + "&lon=" + req.query.lng + "&radius=" + req.query.distance + "&callback=jQuery21307676314746535686_1462858455579&key=.&_=" + n, function(err, data){
    //     console.log("hello")
    //     console.log(err)
    //     console.log(data)
    // })
    // $.ajax({
    //     url: "http://api.spotcrime.com/crimes.json?lat=" + req.query.lat + "&lon=" + req.query.lng + "&radius=" + req.query.distance + "&callback=jQuery21307676314746535686_1462858455579&key=.&_=" + n,
    //     dataType: 'jsonp',
    //     success: function(data) {
    //         console.log("success")
    //         console.log(data)
    //         // your code to handle data here
    //     }
    // });
    // console.log("hello")
    // request("http://api.spotcrime.com/crimes.json?lat=" + req.query.lat +"&lon="+req.query.lng+"&radius="+req.query.distance+"&callback=jQuery21307676314746535686_1462858455579&key=.&_=" + n, function(error, response, body) {
    //     var i = body.indexOf('{');
    //     var data = JSON.parse(body.substring(i, body.length - 1));
    //     // localStorage.setItem('currentCrimes', JSON.stringify(obj));
    //     res.json(data);
    // });
    var sys = require('util');
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        sys.puts("State: " + this.readyState);

        if (this.readyState === 4) {
            var body = this.responseText
                // var i = body.indexOf('{');
                // var data = JSON.parse(body.substring(i, body.length - 1));
            res.json(body);
        }
    };

    xhr.open("GET", "http://api.spotcrime.com/crimes.json?lat=" + req.query.lat + "&lon=" + req.query.lng + "&radius=" + req.query.distance + "&callback=jQuery21307676314746535686_1462858455579&key=.&_=" + n);
    xhr.send();
}