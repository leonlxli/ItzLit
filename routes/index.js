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

// return an array with the count of categories based on the time with hour for Arson
exports.getTimeBarCrimeDataArson = function(req, res){
var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        if (crime.charge_description === "Arson") {
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    }
    });
    res.json(data);
}

// return an array with the count of categories based on the time with hour for Assault
exports.getTimeBarCrimeDataAssault = function(req, res){
var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        if (crime.charge_description === "Assault") {
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    }
    });
    res.json(data);
}

// return an array with the count of categories based on the time with hour for Child Abuse
exports.getTimeBarCrimeDataChildAbuse = function(req, res){
var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        if (crime.charge_description === "Child Abuse") {
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    }
    });
    res.json(data);
}

// return an array with the count of categories based on the time with hour for DUI
exports.getTimeBarCrimeDataDUI = function(req, res){
var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        if (crime.charge_description === "DUI") {
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    }
    });
    res.json(data);
}

// return an array with the count of categories based on the time with hour for Drunk in Public
exports.getTimeBarCrimeDataDrunkinPublic = function(req, res){
var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        if (crime.charge_description === "Drunk in Public") {
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    }
    });
    res.json(data);
}

// return an array with the count of categories based on the time with hour for Possession of Substance
exports.getTimeBarCrimeDataPossessionofSubstance = function(req, res){
var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        if (crime.charge_description === "Possession of Substance") {
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    }
    });
    res.json(data);
}

// return an array with the count of categories based on the time with hour for Possession of Weapon
exports.getTimeBarCrimeDataPossessionofWeapon = function(req, res){
var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        if (crime.charge_description === "Possession of Weapon") {
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    }
    });
    res.json(data);
}

// return an array with the count of categories based on the time with hour for Rape
exports.getTimeBarCrimeDataRape = function(req, res){
var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        if (crime.charge_description === "Rape") {
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    }
    });
    res.json(data);
}

// return an array with the count of categories based on the time with hour for Theft
exports.getTimeBarCrimeDataTheft = function(req, res){
var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        if (crime.charge_description === "Theft") {
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    }
    });
    res.json(data);
}

// return an array with the count of categories based on the time with hour for Vandalism
exports.getTimeBarCrimeDataVandalism = function(req, res){
var time = req.query.time;
    var data = {};
    data["hour"] = time;
    crime_json.forEach(function(crime){
        if (crime.charge_description === "Vandalism") {
        var date = new Date(crime.activity_date);
        if(date.getHours() == time){
            if(!( crime.charge_description in data)){
                data[crime.charge_description] = 1;
            }else{
                data[crime.charge_description]++;
            }
        }
    }
    });
    res.json(data);
}

