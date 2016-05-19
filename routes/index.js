const crime_json = require("../crime_data.json");

exports.view = function(req, res) {
  res.render("index");
}

exports.getAllCrimeData = function (req, res) {
  res.json(crime_json);
}

exports.getTimeCrimeData = function(req, res){
    var time = req.query.time;
    var data = [];
    crime_json.forEach(function(crime){
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            data.push(crime);
        }
    });
    res.json(data);
}

// return an array with the count of categories based on the time
exports.getTimeTypeCrimeData = function(req, res){
    var time = req.query.time;
    var data = {};
    crime_json.forEach(function(crime){
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    });
    res.json(data);
}

// return an array with the count of categories based on the time with hour
exports.getTimeBarCrimeData = function(req, res){
    var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    });
    res.json(data);
}



