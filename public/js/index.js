var map;
var allData;
var infoWindow;
var tooltip;
var currentCrimes;
var lights = [];
var lightsDone = false;
var crimes;
var crimeCoordinates = []
var crimeDone = false;
var heatmap;
var originalCenter;
var originalZoom;
var routeInfo = [];
var spinner;
var routeInfoDone = false;
var dirPolyline;
var directions;
var styleArray = [{
    "stylers": [{
        "hue": "#ff1a00"
    }, {
        "invert_lightness": true
    }, {
        "saturation": -100
    }, {
        "lightness": 33
    }, {
        "gamma": 0.5
    }]
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
        "color": "#2D333C"
    }]
}]
var opts = {
    lines: 13 // The number of lines to draw
        ,
    length: 28 // The length of each line
        ,
    width: 12 // The line thickness
        ,
    radius: 33 // The radius of the inner circle
        ,
    scale: 0.5 // Scales overall size of the spinner
        ,
    corners: 1 // Corner roundness (0..1)
        ,
    color: '#000' // #rgb or #rrggbb or array of colors
        ,
    opacity: 0.2 // Opacity of the lines
        ,
    rotate: 0 // The rotation offset
        ,
    direction: 1 // 1: clockwise, -1: counterclockwise
        ,
    speed: 1.1 // Rounds per second
        ,
    trail: 80 // Afterglow percentage
        ,
    fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        ,
    zIndex: 2e9 // The z-index (defaults to 2000000000)
        ,
    className: 'spinner' // The CSS class to assign to the spinner
        ,
    top: '50%' // Top position relative to parent
        ,
    left: '50%' // Left position relative to parent
        ,
    shadow: false // Whether to render a shadow
        ,
    hwaccel: false // Whether to use hardware acceleration
        ,
    position: 'absolute' // Element positioning
}

function getCrimeImage(type) {
    if (type == "Robbery") {
        return "../images/robbery.png"
    } else if (type == "Assault") {
        return "../images/assault.png"
    } else if (type == "Burglary") {
        return "../images/burglary.png"
    } else if (type == "Arson") {
        return "../images/arson.png"
    } else if (type == "Arrest") {
        return "../images/arrest.png"
    } else if (type == "Shooting") {
        return "../images/shooting.png"
    } else if (type == "Theft") {
        return "../images/theft.png"
    } else if (type == "Vandalism") {
        return "../images/Vandalism.png"
    } else {
        return "../images/other.png"
    }
}

function getCrimeCurr(lat, lng, distance) {
    var d = new Date();
    var n = d.getTime();
    $.ajax({
        url: "https://api.spotcrime.com/crimes.json?lat=" + lat + "&lon=" + lng + "&radius=" + distance + "&callback=jQuery21307676314746535686_1462858455579&key=.&_=" + n,
        dataType: 'jsonp',
        success: function(data) {
            for (var i in data.crimes) {
                var crimeImg = getCrimeImage(data.crimes[i].type);
                var myLatLng = {
                    lat: data.crimes[i].lat,
                    lng: data.crimes[i].lon
                }

                crimeCoordinates.push(myLatLng)

                createCrimeMarker(myLatLng, crimeImg, data.crimes[i])
                if (i == data.crimes.length - 1) {
                    crimeDone = true;
                    if (routeInfoDone && lightsDone) {
                        setLightAndCrimeData()
                    }
                }
            }
        }
    })
}

function createCrimeMarker(myLatLng, crimeImg, info) {
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: crimeImg
    });

    google.maps.event.addListener(marker, 'click', function() {
        console.log(info)
        var contentString = "<div><h1>" + info.type + "</h1><p>date :" + info.date + "</p></div>"
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
}

function setLightAndCrimeData() {
    for (var i in routeInfo) {
        var numCrimes = getNumCrimes(routeInfo[i].polyline);
        var numLights = getNumLights(routeInfo[i].polyline)
        var lightPercent = ((numLights * 15) / routeInfo[i].route.legs[0].distance.value) * 100
        var lightText = (Math.round(lightPercent * 100) / 100) + "% lit"
        routeInfo[i].lights = lightPercent;
        routeInfo[i].lightPercentText = lightText
        routeInfo[i].crimes = numCrimes;
        if (i == routeInfo.length - 1) {
            putData();
        }
    }
}

function putData() {
    spinner.stop();

    routeInfo[0].polyline.setMap(map);
    var info = $("#routeInfo");
    for (var i in routeInfo) {
        var num = Number(i) + 1;
        var lightbulbNum = "lightbulb";

        //get lightbulb pic
        if (routeInfo[i].lights < 1) {
            lightbulbNum = "lightbulb";
        } else if (routeInfo[i].lights < 2) {
            lightbulbNum = "lightbulb1";
        } else if (routeInfo[i].lights < 4) {
            lightbulbNum = "lightbulb2";
        } else if (routeInfo[i].lights < 6) {
            lightbulbNum = "lightbulb4";
        } else if (routeInfo[i].lights < 8) {
            lightbulbNum = "lightbulb6";
        } else if (routeInfo[i].lights < 10) {
            lightbulbNum = "lightbulb8";
        } else if (routeInfo[i].lights < 15) {
            lightbulbNum = "lightbulb10";
        } else if (routeInfo[i].lights < 20) {
            lightbulbNum = "lightbulb15";
        } else if (routeInfo[i].lights < 25) {
            lightbulbNum = "lightbulb20";
        } else if (routeInfo[i].lights < 30) {
            lightbulbNum = "lightbulb25";
        } else if (routeInfo[i].lights < 35) {
            lightbulbNum = "lightbulb30";
        } else if (routeInfo[i].lights < 40) {
            lightbulbNum = "lightbulb35";
        } else if (routeInfo[i].lights < 45) {
            lightbulbNum = "lightbulb40";
        } else if (routeInfo[i].lights < 50) {
            lightbulbNum = "lightbulb45";
        } else if (routeInfo[i].lights < 55) {
            lightbulbNum = "lightbulb50";
        } else if (routeInfo[i].lights < 60) {
            lightbulbNum = "lightbulb55";
        } else if (routeInfo[i].lights < 65) {
            lightbulbNum = "lightbulb60";
        } else if (routeInfo[i].lights < 70) {
            lightbulbNum = "lightbulb65";
        } else if (routeInfo[i].lights < 75) {
            lightbulbNum = "lightbulb70";
        } else if (routeInfo[i].lights < 80) {
            lightbulbNum = "lightbulb75";
        } else if (routeInfo[i].lights < 85) {
            lightbulbNum = "lightbulb80";
        } else if (routeInfo[i].lights < 90) {
            lightbulbNum = "lightbulb85";
        } else if (routeInfo[i].lights < 95) {
            lightbulbNum = "lightbulb90";
        } else if (routeInfo[i].lights < 100) {
            lightbulbNum = "lightbulb95";
        } else {
            lightbulbNum = "lightbulb100";
        }

        info.append("<div id=routeDisplay" + i + " class='routeDisplay' onmouseover='inside(" + i + ")' onmouseout='outside(" + i + ")' onclick='displayDirections(" + i + ")'><table style='width:90%'><tr><td><h4><b>Route " + num + " </b></h4><p><i>" + routeInfo[i].time + ",</i>    " + routeInfo[i].distance + "</p><p>" + routeInfo[i].crimes + " crimes</p></td>" +
            "<td style='align: right; float:right;'><p>" + routeInfo[i].lightPercentText +
            "</p><img src='/images/" + lightbulbNum + ".png' style='width:70px; height:70px'></td></tr></table></div>")
        info.append("<div class = 'directions' id='dir" + i + "'></div>");
    }

    $("#routeDisplay0").addClass("clicked");
    var info = $("#dir0");
    info.append("<p><u><b>Directions:</b></u></p>")

    for (var j in routeInfo[0].steps) {
        info.append(routeInfo[0].steps[j].instructions + '<br />');
    }
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function start() {
    setTimeout(function() {
        CreateDirections(start, end, transportation);
    }, 100);

    var getQueryString = function(field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };

    var start = getQueryString('starting').replace(/%20/g, " "),
        end = getQueryString('ending').replace(/%20/g, " "),
        transportation = getQueryString('transportation');
    console.log(end)
    var startstr = start.substring(0, start.indexOf(','));
    var endstr = end.substring(0, end.indexOf(','));
    if (endstr == "") {
        endstr = end
    }
    if (startstr == "") {
        startstr = start
    }
    if (transportation == "driving") {
        $("#transportation").append('<img src="/images/driving.png" width="35" height="35">');
    } else if (transportation == "walking") {
        $("#transportation").append('<img src="/images/walking.png" width="35" height="35">')
    } else if (transportation == "bicycling") {
        $("#transportation").append('<img src="/images/bicycling.png" width="35" height="35">')
    } else {
        $("#transportation").append('<img src="/images/transit.png" width="35" height="35">')
    }
    console.log(startstr)
    console.log(endstr)
    $("#startingp").append(startstr);
    $("#endingp").append(endstr);
    $.get("/crimes", function(data) {
        crimes = data;
    });
}
$(document).ready(function() {
    var target = document.getElementById('spinner')
    spinner = new Spinner(opts).spin(target);
    target.appendChild(spinner.el)
    $("#routeTabs").css("background-color", "#DEDFE6")

});


window.initMap = function() {
    var autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('loc')), {
            types: ['geocode']
        });
    var sandiego = {
        lat: 32.856130,
        lng: -117.234485
    }
    getCrimeCurr(32.8328, -117.2713, 0.2)
    var minZoomLevel = 13;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: minZoomLevel,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scrollwheel: false
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);



    $.get("/lights", function(data) {
        lights = data.lights;
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: getPoints(),
            map: map,
            gradient: gradient,
            zIndex: 10,
        });
        lightsDone = true;
        if (routeInfoDone && crimeDone) {
            setLightAndCrimeData()
        }
    });
    start();

    service.nearbySearch({
        location: sandiego,
        radius: 25000,
        type: ['police']
    }, createPlacesMarkers);

    map.setOptions({
        styles: styleArray
    });


    function ToggleControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '2px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.marginLeft = '20px';
        controlUI.style.marginTop = '20px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to toggle the heatmap';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '13px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Toggle Heatmap';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
            heatmap.setMap(heatmap.getMap() ? null : map);
        });

    }


    function meterControl(controlDiv, map) {
        var controlUI = document.createElement('div');
        controlUI.style.marginTop = '18px';
        controlUI.style.marginRight = '18px';
        var meter = new Image();
        meter.src = '../images/maplegend.png';
        controlDiv.appendChild(controlUI);
        controlUI.appendChild(meter);
    }

    function lightMeterControl(controlDiv, map) {
        var controlUI = document.createElement('div');
        controlUI.style.marginBottom = '12px';
        var lightmeter = new Image();
        lightmeter.src = '../images/lightmeter.png';
        controlDiv.appendChild(controlUI);
        controlUI.appendChild(lightmeter);
    }

    var ToggleControlDiv = document.createElement('div');
    var ToggleControl = new ToggleControl(ToggleControlDiv, map);


    var meterDiv = document.createElement('div');
    var meterControl = new meterControl(meterDiv, map);

    var lightMeterDiv = document.createElement('div');
    var lightMeterControl = new lightMeterControl(lightMeterDiv, map);

    ToggleControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(ToggleControlDiv);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(meterDiv);
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(lightMeterDiv);

}

function createPlacesMarkers(results, status) {
    console.log("*****SWAG*****" + results.length)
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}
var flagImage = '../images/flag.png'

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: flagImage
    });


    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function inside(i) {
    var route = $("#routeDisplay" + i)
    if (!route.hasClass("clicked")) {
        route.addClass("hovered");
    }
}

function outside(i) {
    var route = $("#routeDisplay" + i)
    if (route.hasClass("hovered")) {
        route.removeClass("hovered");
    }
}

function displayDirections(index) {
    for (var i in routeInfo) {
        var info = $("#dir" + i)
        var routeDiv = $("#routeDisplay" + i)
            //selected div
        if (i == index) {
            //selected was not empty
            if (info.children().length > 0) {
                routeDiv.removeClass("clicked");
                info.empty()
                routeInfo[index].polyline.setMap(null);
            } else {
                info.append("<p><b><u>Directions:</u></b></p>")
                routeDiv.addClass("clicked");
                for (var j in routeInfo[index].steps) {
                    info.append(routeInfo[index].steps[j].instructions + '<br />');
                }
                routeInfo[index].polyline.setMap(map);
            }
        } else {
            routeDiv.removeClass("clicked");
            info.empty();
            routeInfo[i].polyline.setMap(null);
        }
    }
}

function getPoints() {
    var latlangLights = []
    for (i in lights) {
        latlangLights.push(new google.maps.LatLng(Number(lights[i][0]), Number(lights[i][1])));
    }
    return latlangLights;
}



// var gradient = [
//     'rgba(185, 185, 70, 0.0)',
//     'rgba(252, 243, 0, 1)',
//     'rgba(252, 243, 0, 0.9)',
//     'rgba(253, 201, 51, 0.9)',
//     'rgba(253, 199, 0, 1)',
//     'rgba(253, 185, 0, 1)',
//     'rgba(253, 165, 0, 0.9)',
//     'rgba(253, 131, 0, 0.9)',
//     'rgba(254, 116, 0, 1)',
//     'rgba(254, 98, 0, 1)',
//     'rgba(254, 52, 0, 1)',
//     'rgba(255, 3, 0, 1)',
//     'rgba(255, 0, 0, 1)'
// ]
var gradient = [
    'rgba(185, 185, 70, 0.0)',
    'rgba(252, 243, 0, 1)',
    'rgba(252, 243, 0, 0.8)',
    'rgba(252, 243, 0, 0.8)',
    'rgba(252, 243, 0, 0.9)',
    'rgba(252, 243, 0, 0.9)',
    'rgba(252, 243, 0, 0.9)',
    'rgba(252, 243, 0, 1)',
    'rgba(252, 243, 0, 1)',
    'rgba(252, 243, 0, 1)',
    'rgba(252, 243, 0, 1)',
    'rgba(252, 243, 0, 1)',
    'rgba(252, 243, 0, 1)',
]




function getNumLights(polyline) {
    var numLights = 0;
    for (var i in lights) {
        var location = new google.maps.LatLng(Number(lights[i][0]), Number(lights[i][1]))
        if (google.maps.geometry.poly.containsLocation(location, polyline) || google.maps.geometry.poly.isLocationOnEdge(location, polyline, 0.0001)) {
            numLights++;
        }
    }
    return numLights;
}

function getNumCrimes(polyline) {
    numCrimes = 0;
    for (var i in crimeCoordinates) {
        var location = new google.maps.LatLng(crimeCoordinates[i].lat, crimeCoordinates[i].lng)
        if (google.maps.geometry.poly.containsLocation(location, polyline) || google.maps.geometry.poly.isLocationOnEdge(location, polyline, 0.001)) {
            numCrimes++;
        }
    }
    return numCrimes;
}

function CreateDirections(start, end, method, callback) {
    var methodOfTravel;
    if (method == "driving") {
        methodOfTravel = google.maps.TravelMode.DRIVING
    } else if (method == "walking") {
        methodOfTravel = google.maps.TravelMode.WALKING
    } else if (method == "transit") {
        methodOfTravel = google.maps.TravelMode.TRANSIT
    } else if (method == "bike") {
        methodOfTravel = google.maps.TravelMode.BICYCLING
    } else {
        methodOfTravel = google.maps.TravelMode.WALKING
    }
    var directionsService = new google.maps.DirectionsService;

    directionsService.route({
        origin: start,
        destination: end,
        provideRouteAlternatives: true,
        travelMode: methodOfTravel
    }, function(response, status) {
        var createPolylines = function() {
            if (originalCenter == null || originalZoom == null) {
                originalCenter = map.getCenter();
                originalZoom = map.getZoom();
            }
            for (var route in response.routes) {
                dirPolyline = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: "gray",
                        zIndex: 1,
                    },
                    map: map,
                    directions: response,
                    routeIndex: Number(route)
                });
                dirPolyline.setMap(map);
                var bounds = response.routes[route].overview_path;
                var newBounds = []
                for (var i in bounds) {
                    var point = {}
                    point.lat = bounds[i].lat()
                    point.lng = bounds[i].lng()
                    newBounds.push(point)
                }
                var polyline = new google.maps.Polyline({
                    path: newBounds,
                    strokeColor: "#05E9FF",
                    strokeOpacity: 0.7,
                    strokeWeight: 10,
                    zIndex: 2,
                });
                routeInfo.push({
                    directionLine: dirPolyline,
                    route: response.routes[route],
                    polyline: polyline,
                    distance: response.routes[route].legs[0].distance.text,
                    time: response.routes[route].legs[0].duration.text,
                    steps: response.routes[route].legs[0].steps
                })
                if (Number(route) == response.routes.length - 1) {
                    routeInfoDone = true;
                    if (lightsDone && crimeDone) {
                        setLightAndCrimeData()
                    }
                }
            }
        }
        createPolylines();
    });
}




//navbar animation
$("[href^='#']").on("click", function(e) {
    var target = $(this).attr('href');
    var scrollTop = $(target).offset().top - $('.header').height() - $('.header').outerHeight();

    if (target == '#home') {
        scrollTop = 0;
    }
    $("body, html").animate({
        scrollTop: scrollTop
    }, 800);

    e.preventDefault();
});