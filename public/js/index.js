var map;
var allData;
var infoWindow;
var tooltip;
var currentCrimes;
var SDCrimes;
var lights = [];
var lightsDone = false;
var crimes;
var crimeCoordinates = []
var crimeDone = false;
var heatmap;
var originalCenter;
var originalZoom;

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

function getCrimeImage(type){
    if(type=="Robbery"){
        return "../images/robbery.png"
    }
    else if(type=="Assault"){
        return "../images/assault.png"
    }
    else if(type=="Burglary"){
        return "../images/burglary.png"
    }
    else if(type=="Arson"){
        return "../images/arson.png"
    }
    else if(type=="Arrest"){
        return "../images/arrest.png"
    }
    else if(type=="Shooting"){
        return "../images/shooting.png"
    }
    else if(type=="Theft"){
        return "../images/theft.png"
    }
    else if(type=="Vandalism"){
        return "../images/Vandalism.png"
    }
    else{
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
            SDCrimes = data;
            for (var i in SDCrimes.crimes) {
                // crimeCoordinates.push([SDCrimes.crimes[i].lat, SDCrimes.crimes[i].lon])
                var crimeImg = getCrimeImage(SDCrimes.crimes[i].type);
                console.log(crimeImg)
                var myLatLng = {
                    lat: SDCrimes.crimes[i].lat,
                    lng: SDCrimes.crimes[i].lon
                }
                crimeCoordinates.push(myLatLng)
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: crimeImg
                });
                marker.addListener('click', function() {
                    var contentString = "<div><h1>" + SDCrimes.crimes[i].type + "</h1></div>"
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    infowindow.open(map, marker);
                });
            }
            crimeDone = true;
        }
    })
}

function start() {
    var target = document.getElementById('spinner')
    var spinner = new Spinner(opts).spin(target);
    target.appendChild(spinner.el)

    $.get("/lights", function(data) {
        lights = data.lights;
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: getPoints(),
            map: map,
            gradient: gradient
        });

        lightsDone = true
    });
    var CrimeData;
    $.get("/crimes", function(data) {
        crimes = data;
    });

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

    setTimeout(function() {
        CreateDirections(start, end, transportation, function(res, err) {
            spinner.stop();
            console.log(res)
            var info = $("#routeInfo");
            for (var i in res) {
                var num = Number(i)+1;
                info.append("<div onclick='displayDirections(" + i + ")'><h4>Route " + num + "</h4><p>" + res[i].lightPercentText + "</p><p>Crimes:" + res[i].crimes + "</p><p>" + res[i].time + "</p>" + "</p><p>" + res[i].distance + "</p></div>")
            }
        });
    }, 1000);
}

window.initMap = function() {

    console.log("hi")
    var minZoomLevel = 13;
    // $.get('/directions', function(data) {
    //     console.log(data)
    // })
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: minZoomLevel,
        // center: new google.maps.LatLng(32.8787, -117.0400),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scrollwheel: false
    });
    start();

    // var myLatLng = {
    //     lat: 32.7157,
    //     lng: -117.1611
    // }
    // crimeCoordinates.push(myLatLng)

    // var marker = new google.maps.Marker({
    //     position: myLatLng,
    //     map: map,
    //     title: 'Hello World!'
    // });
    // console.log(marker)

    map.data.setStyle(function(feature) {
        var color = feature.getProperty('color');
        return ({
            fillColor: color,
            fillOpacity: 0.5,
            strokeWeight: 2
        });
    });

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

    function CenterControl(controlDiv, map) {

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
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '13px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Center Map';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
            map.setCenter(originalCenter);
            map.setZoom(originalZoom);
            // map.setZoom(minZoomLevel);
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

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    var ToggleControlDiv = document.createElement('div');
    var ToggleControl = new ToggleControl(ToggleControlDiv, map);
    // var meter = new Image();
    // meter.src = '../images/meter.png';

    var meterDiv = document.createElement('div');
    var meterControl = new meterControl(meterDiv, map);

    ToggleControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(ToggleControlDiv);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(meterDiv);

}


function displayDirections(index){
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
    'rgba(185, 185, 70, 0.8)',
    'rgba(191, 191, 64, 0.6)',
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

//for highlighting selected uber
$('.uberType').mouseenter(function() {
    if (!$(this).hasClass("selected")) {
        $(this).addClass("hovered");
    }
}).mouseleave(function() {
    $(this).removeClass("hovered");
}).click(function() {
    var buttons = $('.uberType');
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i] != this) {
            $(buttons[i]).removeClass("selected")
        } else {
            $(buttons[i]).addClass("selected")
            $(buttons[i]).removeClass("hovered")
            limit = 0;
            index = 0;
        }
    }
});


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



function CreateDirections(start, end, method, callback) {
    var geocoder = new google.maps.Geocoder();
    var startcoord;
    geocoder.geocode({
        address: start
    }, function(results, status) {
        console.log(results[0].geometry.location.lat())
        getCrimeCurr(results[0].geometry.location.lat(), results[0].geometry.location.lng(), 0.2)

        // $.get("/currentCrimes", {
        //     lat: results[0].geometry.location.lat(),
        //     lng: results[0].geometry.location.lng(),
        //     distance: 0.5
        // }, function(data) {
        //     currentCrimes = data;
        //     for (var i in currentCrimes.crimes) {
        //         crimeCoordinates.push([currentCrimes.crimes[i].lat, currentCrimes.crimes[i].lon])
        //     }
        //     crimeDone = true;
        // });
    });
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
        for (var i = 0, len = response.routes.length; i < len; i++) {
            new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                routeIndex: i
            });
        }
        var routeInfo = []
        console.log(response.routes)

        var check = function() {
            if (originalCenter == null || originalZoom == null) {
                originalCenter = map.getCenter();
                originalZoom = map.getZoom();
            }
            if (lightsDone && crimeDone) {
                for (var route in response.routes) {
                    // console.log(response.routes[route])

                    var bounds = response.routes[route].overview_path;
                    var newBounds = []
                    for (var i in bounds) {
                        var point = {}
                        point.lat = bounds[i].lat()
                        point.lng = bounds[i].lng()
                        newBounds.push(point)
                    }
                    var polyline = new google.maps.Polyline({
                        path: newBounds
                    });


                    var numLights = 0
                    var numCrimes = 0;
                    for (var i in lights) {
                        var location = new google.maps.LatLng(Number(lights[i][0]), Number(lights[i][1]))
                        if (google.maps.geometry.poly.containsLocation(location, polyline) || google.maps.geometry.poly.isLocationOnEdge(location, polyline, 0.0001)) {
                            // console.log("here")
                            numLights++;
                        }
                    }
                    for (var i in crimeCoordinates) {
                        console.log(i)
                        var location = new google.maps.LatLng(crimeCoordinates[i].lat, crimeCoordinates[i].lng)
                        if (google.maps.geometry.poly.containsLocation(location, polyline) || google.maps.geometry.poly.isLocationOnEdge(location, polyline, 0.001)) {
                            numCrimes++;
                        }
                    }
                    var lightPercent = ((numLights * 25) / response.routes[route].legs[0].distance.value) * 100
                    var lightText = (Math.round(lightPercent * 100) / 100) + "% lit"
                    routeInfo.push({
                        route: response.routes[route],
                        crimes: numCrimes,
                        lights: lightPercent,
                        lightPercentText: lightText,
                        distance: response.routes[route].legs[0].distance.text,
                        time: response.routes[route].legs[0].duration.text,
                        poyline: polyline
                    })
                }
                callback(routeInfo, null);
            } else {
                console.log("again")
                setTimeout(check, 1000); // check again in a second
            }
        }
        check();
    });
}


//Getting starting location
$("#currLocation").click(function() {
    console.log("Getting location");
    getLocation();
    return false;
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
        alert('It seems like Geolocation, which is required for this page, is not enabled in your browser.');
    }
}

function successFunction(position) {
    var lati = position.coords.latitude;
    var long = position.coords.longitude;
    //alert('Your latitude is :' + lati + ' and longitude is ' + long);
    var latlng = lati + " , " + long;
    geoLocate(latlng);
}

function geoLocate(LATLNG) {
    var input = LATLNG;
    var latlngStr = input.split(',', 2);
    var latlng = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1])
    };

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        'location': latlng
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                //infowindow.setContent(results[1].formatted_address);
                $("#starting").text(results[0].formatted_address);
                $("#starting").val(results[0].formatted_address);
                console.log("Got location");
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

function errorFunction(position) {
    alert("Couldn't get your location!");
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
