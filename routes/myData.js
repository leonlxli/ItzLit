// var request = require("request");

exports.getCrimes = function(req, res) {
    var data = require('../crime_data.json')
    lights = data;
    res.json(data);
}

function Comparator(a, b) {
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return 0;
}

exports.getLights = function(req, res) {
    var data = require('../street_lights.json');
    // console.log(data.lights)
    // var lightsDat = data.lights.sort(Comparator);
    // var obj = {"lights": lightsDat}
    // console.log(JSON.stringify(obj))
    res.json(data);
}

exports.getCurrentCrimes = function(req, res) {
    var d = new Date();
    var n = d.getTime();
    var sys = require('util');
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        sys.puts("State: " + this.readyState);
        if (this.readyState === 4) {
            var body = this.responseText
            res.json(body);
        }
    };

    xhr.open("GET", "http://api.spotcrime.com/crimes.json?lat=" + req.query.lat + "&lon=" + req.query.lng + "&radius=" + req.query.distance + "&callback=jQuery21307676314746535686_1462858455579&key=.&_=" + n);
    xhr.send();
}