var pg = require('pg');
var jsonfile = require('jsonfile');


function rename(data) {
    for (var attrname in data['Anza Borrego Springs']) {
        data['Anza Borrego'][attrname] = data['Anza Borrego Springs'][attrname];
    }

    for (var attrname in data['Southeast San Diego']) {
        data['Southeastern San Diego'][attrname] = data['Southeast San Diego'][attrname];
    }

    var toDelete = ['Southeast San Diego', 'Anza Borrego Springs', 'San Diego County', 'North Coastal Region', 'North Central Region', 'Central Region', 'South Region', 'East Region', 'North Inland Region', 'County Total', 'Harbison Crest El Cajon combo', 'Harbison Crest El Cajon'];
    for (var i = 0; i < toDelete.length; i++) {
        delete data[toDelete[i]];
    }
    return data
}

exports.saveData = function(req, res) {
    var conString = process.env.DATABASE_CONNECTION_URL;

    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) {
            console.error('could not connect to postgres', err);
        } else {
            console.log("Successfully connected to postgres")
        }
    });
    data = {};

    client.query('SELECT hhsa_san_diego_demographics_median_income_2012."Area", hhsa_san_diego_demographics_median_income_2012."Median Household Income" FROM cogs121_16_raw.hhsa_san_diego_demographics_median_income_2012', function(err, dat) {
        for (var i = 0; i < dat.rows.length; i++) {
            var area = dat.rows[i]['Area'].trim().replace("SD", "San Diego");
            area = area.split('-').join(' ');
            data[area] = {
                "Median income": dat.rows[i]['Median Household Income']
            }
        }
        console.log("Done loading income")

    });

    client.query('SELECT hhsa_san_diego_demographics_county_population_2012."Area", hhsa_san_diego_demographics_county_population_2012."Total 2012 Population" FROM cogs121_16_raw.hhsa_san_diego_demographics_county_population_2012;', function(err, dat) {
        for (var i = 0; i < dat.rows.length; i++) {
            var area = dat.rows[i]['Area'].trim().replace("SD", "San Diego");
            area = area.split('-').join(' ');

            if (data[area]) {
                data[area]['population'] = dat.rows[i]['Total 2012 Population']
            } else {
                data[area] = {
                    'population': dat.rows[i]['Total 2012 Population']
                }
            }
        }
        console.log("Done loading population")

    });

    client.query('SELECT hhsa_san_diego_demographics_household_composition_2012."Subregional Area", hhsa_san_diego_demographics_household_composition_2012."Family households -with children age<18" FROM cogs121_16_raw.hhsa_san_diego_demographics_household_composition_2012;', function(err, dat) {
        for (var i = 0; i < dat.rows.length; i++) {
            var area = dat.rows[i]['Subregional Area'].trim().replace("SD", "San Diego");
            area = area.split('-').join(' ');
            if (data[area]) {
                data[area]['Family Households With Children'] = dat.rows[i]['Family households -with children age<18']
            } else {
                data[area] = {
                    'Family Households With Children': dat.rows[i]['Family households -with children age<18']
                }
            }
        }
        console.log("done loading family households with children")
    });

    client.query('SELECT hhsa_san_diego_demographics_county_popul_by_race_2012_norm."Area", hhsa_san_diego_demographics_county_popul_by_race_2012_norm."Population" FROM cogs121_16_raw.hhsa_san_diego_demographics_county_popul_by_race_2012_norm WHERE hhsa_san_diego_demographics_county_popul_by_race_2012_norm."Race" = \'Hispanic\';', function(err, dat) {
        for (var i = 0; i < dat.rows.length; i++) {
            var area = dat.rows[i]['Area'].trim().replace("SD", "San Diego");
            area = area.split('-').join(' ');
            if (data[area]) {
                data[area]['Hispanic Population'] = dat.rows[i]['Population']
            } else {
                data[area] = {
                    'Hispanic Population': dat.rows[i]['Population']
                }
            }
        }
        console.log("Done loading Hispanic population")
    });
    client.query('SELECT hhsa_san_diego_demographics_vehicle_availability_2012."Area", hhsa_san_diego_demographics_vehicle_availability_2012."no vehicle available", hhsa_san_diego_demographics_vehicle_availability_2012."1 vehicle available" FROM cogs121_16_raw.hhsa_san_diego_demographics_vehicle_availability_2012;', function(err, dat) {
        for (var i = 0; i < dat.rows.length; i++) {
            var area = dat.rows[i]['Area'].trim().replace("SD", "San Diego");
            area = area.split('-').join(' ');
            if (data[area]) {
                data[area]['Families without vehicles'] = dat.rows[i]['no vehicle available'];
                data[area]['Families with only 1 vehicle'] = dat.rows[i]['1 vehicle available'];
            } else {
                data[area] = {
                    'Families without vehicles': dat.rows[i]['no vehicle available'],
                    'Families with only 1 vehicle': dat.rows[i]['1 vehicle available']
                }
            }
        }
    });
    client.query('SELECT hhsa_san_diego_demographics_occupational_industry_2012."Area", hhsa_san_diego_demographics_occupational_industry_2012."Occupation - total all occupations" FROM cogs121_16_raw.hhsa_san_diego_demographics_occupational_industry_2012;', function(err, dat) {
        for (var i = 0; i < dat.rows.length; i++) {
            var area = dat.rows[i]['Area'].trim().replace("SD", "San Diego");
            area = area.split('-').join(' ');
            if (data[area]) {
                data[area]['Number of people working in this region'] = dat.rows[i]['Occupation - total all occupations']
            } else {
                data[area] = {
                    'Number of people working in this region': dat.rows[i]['Occupation - total all occupations']
                }
            }
        }
        var data2 = rename(data);
        var result = getScaledData(data2);
        console.log(result);
        res.json(result);
    });
}

function numSort(a, b) {
    return a - b;
}

function getScaledData(data) {
    var popArry = [];
    var incomeArry = [];
    var householdArry = [];
    var hispanicPopArry = [];
    var WO_Vehicle_array = [];
    var one_vehicle_array = [];
    var workers_array = [];

    //set up arrays
    for (var attr in data) {
        popArry.push(data[attr]['population']);
        incomeArry.push(Number(data[attr]['Median income'].replace(/(^\$|,)/g, '')));
        householdArry.push(data[attr]['Family Households With Children']);
        hispanicPopArry.push(data[attr]['Hispanic Population']);
        WO_Vehicle_array.push(data[attr]['Families without vehicles']);
        one_vehicle_array.push(data[attr]['Families with only 1 vehicle']);
        workers_array.push(data[attr]['Number of people working in this region']);
    }
    //sort arrays
    popArry.sort(numSort);
    incomeArry.sort(numSort);
    householdArry.sort(numSort);
    hispanicPopArry.sort(numSort);
    WO_Vehicle_array.sort(numSort);
    one_vehicle_array.sort(numSort);
    workers_array.sort(numSort);

    for (var attr in data) {
        data[attr]['scaled data'] = {}
        var index = popArry.indexOf(data[attr]['population']);
        data[attr]['scaled data']['population scaled'] = (index + 1) / popArry.length * 10;
        index = incomeArry.indexOf(Number(data[attr]['Median income'].replace(/(^\$|,)/g, '')));
        data[attr]['scaled data']['Median income scaled'] = (index + 1) / incomeArry.length * 10;
        index = householdArry.indexOf(data[attr]['Family Households With Children']);
        data[attr]['scaled data']['Family Households With Children scaled'] = (index + 1) / householdArry.length * 10;
        index = hispanicPopArry.indexOf(data[attr]['Hispanic Population']);
        data[attr]['scaled data']['Hispanic Population scaled'] = (index + 1) / hispanicPopArry.length * 10;
        index = WO_Vehicle_array.indexOf(data[attr]['Families without vehicles']);
        data[attr]['scaled data']['Families without vehicles scaled'] = (index + 1) / WO_Vehicle_array.length * 10;
        index = one_vehicle_array.indexOf(data[attr]['Families with only 1 vehicle']);
        data[attr]['scaled data']['Families with only 1 vehicle scaled'] = (index + 1) / one_vehicle_array.length * 10;
        index = workers_array.indexOf(data[attr]['Number of people working in this region']);
        data[attr]['scaled data']['Number of people working in this region'] = (index + 1) / workers_array.length * 10;
    }
    return data;
}

exports.getData = function(req, res) {
    var data = require('../DelphiUberData.json');
    console.log(data);
    res.json = data;
}

