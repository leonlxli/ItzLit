exports.getCrimes = function(req, res) {
    var data = require('../crime_data.json')
    console.log(data);
    res.json(data);
}

exports.getLights = function(req,res){
    var data = require('../street_lights.json');
    console.log(data);
    res.json(data);
}