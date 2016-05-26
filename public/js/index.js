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
        url: "http://api.spotcrime.com/crimes.json?lat=" + lat + "&lon=" + lng + "&radius=" + distance + "&callback=jQuery21307676314746535686_1462858455579&key=.&_=" + n,
        dataType: 'jsonp',
        success: function(data) {
            for (var i in data.crimes) {
                var crimeImg = getCrimeImage(data.crimes[i].type);
                var myLatLng = {
                    lat: data.crimes[i].lat,
                    lng: data.crimes[i].lon
                }
                crimeCoordinates.push(myLatLng)
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: crimeImg
                });
                marker.addListener('click', function() {
                    var contentString = "<div><h1>" + data.crimes[i].type + "</h1></div>"
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    infowindow.open(map, marker);
                });
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

function setLightAndCrimeData() {
    for (var i in routeInfo) {
        var numCrimes = getNumCrimes(routeInfo[i].polyline);
        var numLights = getNumLights(routeInfo[i].polyline)
        console.log((numLights * 25))
        console.log(routeInfo[i].route.legs[0].distance.value)
        var lightPercent = ((numLights * 25) / routeInfo[i].route.legs[0].distance.value) * 100
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
    // routeInfo[0].polyline.setMap(map);
    console.log(routeInfo[0].directionLine)
    routeInfo[0].polyline.setMap(map);
    var info = $("#routeInfo");
    for (var i in routeInfo) {
        var num = Number(i) + 1;
        console.log(i)
        info.append("<div onclick='displayDirections(" + i + ")'><h4>Route " + num + "</h4><p>" + routeInfo[i].lightPercentText + "</p><p>Crimes:" + routeInfo[i].crimes + "</p><p>" + routeInfo[i].time + "</p>" + "</p><p>" + routeInfo[i].distance + "</p></div>")
        for (var j in routeInfo[i].steps) {

            info.append(routeInfo[i].steps[j].instructions + '<br />');
        }
    }
    console.log("routeInfo")
    console.log(routeInfo)
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

    $("#startingp").text(start);
    $("#endingp").text(end);
    $.get("/crimes", function(data) {
        crimes = data;
    });
}
$(document).ready(function() {
    var target = document.getElementById('spinner')
    spinner = new Spinner(opts).spin(target);
    target.appendChild(spinner.el)
});

window.initMap = function() {
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
    $.get("/lights", function(data) {
        lights = data.lights;
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: getPoints(),
            map: map,
            gradient: gradient,
            zIndex: 3
        });
        lightsDone = true;
        if (routeInfoDone && crimeDone) {
            setLightAndCrimeData()
        }
    });
    start();

    map.data.setStyle(function(feature) {
        var color = feature.getProperty('color');
        return ({
            fillColor: color,
            fillOpacity: 0.5,
            strokeWeight: 2
        });
    });

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
        var meter = new Image();
        meter.src = '../images/maplegend.png';
        controlDiv.appendChild(controlUI);
        controlUI.appendChild(meter);
    }


    var ToggleControlDiv = document.createElement('div');
    var ToggleControl = new ToggleControl(ToggleControlDiv, map);
    // var meter = new Image();
    // meter.src = '../images/meter.png';

    var meterDiv = document.createElement('div');
    var meterControl = new meterControl(meterDiv, map);

    ToggleControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(ToggleControlDiv);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(meterDiv);

}


function displayDirections(index) {
    console.log(routeInfo)
    for (var i in routeInfo) {
        console.log(i + " vs " + index)
        console.log(routeInfo[i]);
        if (i == index) {
            console.log("supposed to set")
            console.log(routeInfo[i].polyline)
            routeInfo[index].polyline.setMap(map);
        } else {
            routeInfo[i].polyline.setMap(null);
        }
    }
    console.log(index)
}

function getPoints() {
    var latlangLights = []
    for (i in lights) {
        latlangLights.push(new google.maps.LatLng(Number(lights[i][0]), Number(lights[i][1])));
    }
    return latlangLights;
}



var gradient = [
    'rgba(185, 185, 70, 0.0)',
    'rgba(185, 185, 70, 1)',
    'rgba(198, 198, 57, 0.6)',
    'rgba(204, 204, 51, 0.8)',
    'rgba(210, 210, 45, 0.8)',
    'rgba(217, 217, 38, 0.8)',
    'rgba(223, 223, 32, 0.8)',
    'rgba(230, 230, 25, 0.9)',
    'rgba(236, 236, 19, 1)',
    'rgba(242, 242, 13, 1)',
    'rgba(249, 249, 6, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)'
]




$('#d3').hide();
//var data = [4, 8, 15, 16, 23, 42];
// Function to create the bar graph
function buildGraph(myData) {
    d3.selectAll("svg > *").remove();

    //var obj = allData[i].data['scaled data']; // gets all the scaled data json
    // var arr = Object.keys(obj).map(function(k) {
    //     return obj[k]
    // }); // converts the values to an array
    //var key = Object.keys(obj); // gets the key of json

    var scale = {
        //x: d3.scale.ordinal(),
        y: d3.scale.linear()
    };
    var margin = {
            top: 20,
            right: 20,
            bottom: 70,
            left: 40
        },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    function mergeArray(keyArray, valueArray) {
        var result = [];
        var tmp = [];
        for (var i = 0; i < keyArray.length; i++) {
            tmp = [keyArray[i], valueArray[i]];
            result.push(tmp);
        }
        return result;
    }

    //var dataset = mergeArray(key, arr);

    scale.y.domain([0, 10]);
    scale.y.range([height, 0]);

    var barWidth = 20;

    var chart = d3.select('.chart')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    var yScale = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");


    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10);

    var mapper = [];

    for (var key in myData.data['scaled data']) {
        mapper.push({
            'name': key.replace(' scaled', ''),
            'value': myData.data['scaled data'][key]
        });
    }

    xScale.domain(mapper.map(function(d) {
        return d.name;
    }));
    yScale.domain([0, 10]);

    var padding = 1;

    chart
        .selectAll(".bar")
        .data(mapper)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
            return xScale(d.name);
        })
        .attr("width", xScale.rangeBand())
        .attr("y", function(d) {
            return yScale(d.value);
        })
        .attr("height", function(d) {
            return height - yScale(d.value);
        });

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    chart
        .append("g").attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-18)");;


    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -35)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Rankings Compared to Other Regions");
    return chart;
}

function getNumLights(polyline) {
    console.log("lights done")
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
    console.log("checking crimes now")
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
        console.log('fuking shit');
        console.log(response);

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
            setLightAndCrimeData()
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