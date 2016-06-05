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

exports.getCountCrimeData = function(req, res){
    var data = [];
    var temp = [];
    crime_json.forEach(function(crime){
             if(!( crime.charge_description in temp)){
                    temp[crime.charge_description] = 1;
                    // data.push({
                    //     label: crime.charge_description,
                    //     count: data[crime.charge_description] 
                    // });
                data.push({
                    "label": crime.charge_description,
                    "count": 0
                })
                }

            else {
                temp[crime.charge_description]++;
            }
        });

        // label1 = "Arson"
        // console.log("label", data[0].label);
        for (i = 0; i < data.length; i++) {
            if (data[i].label === "Arson") {
                data[i].count = temp["Arson"];
            }
            else if (data[i].label === "Assault") {
                data[i].count = temp["Assault"];
            }
            else if (data[i].label === "Drunk in Public") {
                data[i].count = temp["Drunk in Public"];
            }
            else if (data[i].label === "Child Abuse") {
                data[i].count = temp["Child Abuse"];
            }
            else if (data[i].label === "Elder Abuse") {
                data[i].count = temp["Elder Abuse"];
            }
            else if (data[i].label === "DUI") {
                data[i].count = temp["DUI"];
            }
            else if (data[i].label === "Possession of Substance") {
                data[i].count = temp["Possession of Substance"];
            }
            else if (data[i].label === "Possession of Weapon") {
                data[i].count = temp["Possession of Weapon"];
            }
            else if (data[i].label === "Vandalism") {
                data[i].count = temp["Vandalism"];
            }
            else if (data[i].label === "Murder") {
                data[i].count = temp["Murder"];
            }
            else if (data[i].label === "Rape") {
                data[i].count = temp["Rape"];
            }
            else if (data[i].label === "Theft") {
                data[i].count = temp["Theft"];
            }
        }
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

