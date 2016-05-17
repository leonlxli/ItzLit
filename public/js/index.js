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

function getPoints(){
    var latlangLights = []
    for(i in lights){
         latlangLights.push(new google.maps.LatLng(Number(lights[i][0]), Number(lights[i][1])));
    }
    return latlangLights;
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}



$(document).ready(function() {
    //selectUber('UberX');

    $.get("/currentCrimes", {
        lat: 32.7157,
        lng: -117.1611,
        distance: 8.00
    }, function(data) {
        SDCrimes = data;
        for (var i in currentCrimes.crimes) {
            crimeCoordinates.push([currentCrimes.crimes[i].lat, currentCrimes.crimes[i].lon])
        }
        crimeDone = true;
    });

    $.get("/lights", function(data) {
        lights = data.lights;
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: getPoints(),
            map: map
        });
        lightsDone = true
    });
    var CrimeData;
    $.get("/crimes", function(data) {
        crimes = data;

    });

    $("#all").addClass("selected");

    $('#rankings').children('button').remove();
    $('#rankings').children('div').remove();

});

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
        $.get("/currentCrimes", {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            distance: 1.00
        }, function(data) {
            currentCrimes = data;
            for (var i in currentCrimes.crimes) {
                crimeCoordinates.push([currentCrimes.crimes[i].lat, currentCrimes.crimes[i].lon])
            }
            crimeDone = true;
        });
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
                        var location = new google.maps.LatLng(Number(crimeCoordinates[i][0]), Number(crimeCoordinates[i][1]))
                        if (google.maps.geometry.poly.containsLocation(location, polyline) || google.maps.geometry.poly.isLocationOnEdge(location, polyline, 0.001)) {
                            // console.log("here")
                            numCrimes++;
                        }
                    }
                    var lightPercent = ((numLights * 40) / response.routes[route].legs[0].distance.value) * 100
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

window.initMap = function() {
    console.log("hi")
    var minZoomLevel = 13;
    // $.get('/directions', function(data) {
    //     console.log(data)
    // })


    map = new google.maps.Map(document.getElementById('map'), {
        zoom: minZoomLevel,
        center: new google.maps.LatLng(32.8787, -117.0400),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scrollwheel: false
    });

    map.data.setStyle(function(feature) {
        var color = feature.getProperty('color');
        return ({
            fillColor: color,
            fillOpacity: 0.5,
            strokeWeight: 2
        });
    });


    var styleArray = [{"stylers":[{"hue":"#ff1a00"},
        {"invert_lightness":true},
        {"saturation":-100},
        {"lightness":33},
        {"gamma":0.5}]},
        {"featureType":"water",
        "elementType":"geometry",
        "stylers":[{"color":"#2D333C"}]}
    ]

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

    var ToggleControlDiv = document.createElement('div');
    var ToggleControl = new ToggleControl(ToggleControlDiv, map);
    // var meter = new Image();
    // meter.src = '../images/meter.png';

    ToggleControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(ToggleControlDiv);
    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(meter);
    // console.log(map.controls[google.maps.ControlPosition.BOTTOM_LEFT]);


    // // Bounds for North America
    // var strictBounds = new google.maps.LatLngBounds(
    //     new google.maps.LatLng(32.7297, -117.0451),
    //     new google.maps.LatLng(33.2157, -117.0300));
    //
    // // Listen for the dragend event
    // var lastValidCenter = map.getCenter();
    // google.maps.event.addListener(map, 'center_changed', function() {
    //     if (strictBounds.contains(map.getCenter())) {
    //         // still within valid bounds, so save the last valid position
    //         lastValidCenter = map.getCenter();
    //         return;
    //     }
    //
    //     // not valid anymore => return to last valid position
    //     map.panTo(lastValidCenter);
    // });

    // Limit the zoom level

    // var cityName;
    //
    // infoWindow = new google.maps.InfoWindow({
    //
    // });
    // Creates the infoWindow object

//     google.maps.event.addListener(map, 'click', function(event) {
//         infoWindow.close();
//         infoWindow = new google.maps.InfoWindow({
//             content: '<div class="scrollFix"></div>'
//         });
//         var html = "<center><p>Please click on an outlined<br>region for data!</p></center>";
//         infoWindow.setContent(html);
//         var latlng = event.latLng;
//         //console.log(latlng);
//         infoWindow.setPosition(latlng);
//         infoWindow.open(map);
//     });
//
//     map.data.addListener('click', function(event) {
//         infoWindow.close();
//         infoWindow = new google.maps.InfoWindow({
//             content: '<div class="scrollFix"></div>'
//         });
//
//         var rawData;
//         cityName = event.feature.getProperty('NAME');
//         for (i = 0; i < allData.length; i++) {
//             if (cityName.toUpperCase() == allData[i].Area.toUpperCase()) {
//                 // Render Data for bar graphs
//                 // console.log(allData[i].data['scaled data']);
//                 var bars = buildGraph(allData[i], infoWindow);
//                 var raw = allData[i].data;
//
//                 rawData =
//                     '<div class="row">' +
//                     '<br />' +
//                     '<p class="col-md-6"><strong> Population: </strong>' + raw['population'] + '</p>' +
//                     '<p class="col-md-6"><strong> Median income: </strong>' + raw['Median income'] + '</p>' +
//                     '<p class="col-md-6"><strong> Family Households With Children: </strong>' + raw['Family Households With Children'] + '</p>' +
//                     '<p class="col-md-6"><strong> Hispanic Population: </strong>' + raw['Hispanic Population'] + '</p>' +
//                     '<p class="col-md-6"><strong> Families without vehicles: </strong>' + raw['Families without vehicles'] + '</p>' +
//                     '<p class="col-md-6"><strong> Families with only 1 vehicle: </strong>' + raw['Families with only 1 vehicle'] + '</p>' +
//                     '<p class="col-md-6"><strong> Number of people working in this region: </strong>' + raw['Number of people working in this region'] + '</p>' +
//                     '</div>';
//             }
//         }
//         var html = "<p>" + cityName + "</p>";
//         var d3 = $('#d3').html();
//         // console.log(d3);
//         infoWindow.setContent('<div class="scrollFix">' + html + d3 + rawData + '</div>');
//         //buildGraph(html, infoWindow);
//     })
//
//     // Opens infoWindow on click
//     map.data.addListener("click", function(event) {
//         infoWindow.close();
//         var latlng = event.latLng;
//         if (tooltip) {
//             tooltip.close();
//         }
//         infoWindow.setPosition(latlng);
//         infoWindow.open(map);
//         map.setCenter(infoWindow.getPosition());
//
//     });
//
//     // Closes window when mouseOut
//     map.data.addListener("mouseout", function(event) {
//         // infoWindow.close();
//         if (tooltip) tooltip.close();
//         map.data.overrideStyle(event.feature, {
//             strokeWeight: 2
//         });
//     });
//
//     map.data.addListener('mouseover', function(event) {
//         tooltip = new google.maps.InfoWindow({
//             pixelOffset: new google.maps.Size(0, -10)
//         });
//         tooltip.setPosition(event.latLng);
//         tooltip.setContent('<p>' + event.feature.getProperty('NAME') + '</p><p> Click for more Information</p>');
//         tooltip.open(map);
//         map.data.overrideStyle(event.feature, {
//             strokeWeight: 6
//         });
//     });
//     map.data.addListener('mousemove', function(event) {
//         tooltip.setPosition(event.latLng);
//     });
}


$("a.page-scroll").click(function() {
    $('html,body').animate({
            scrollTop: $("#selectButtons").offset().top
        },
        'slow');
});

$("img.uberType").click(function() {
    $('html,body').animate({
            scrollTop: $("#sidebar").offset().top
        },
        'slow');
});

$('#destinations-form').submit(function(e) {
    console.log('fuk ');
    e.preventDefault();
    var starting = $('#starting').val();
    var ending = $('#ending').val();
    window.location.href = '/maps?starting=' + starting + '&ending=' + ending;
});

//Getting starting location
$("#currLocation").click(function () {
    //rotation();
    console.log("Getting location");
    getLocation();
    return false;
});

var rotation = function () {
    $("#currLocation").rotate({
        angle: 0,
        animateTo: 360,
        callback: rotation
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
        alert('It seems like Geolocation, which is required for this page, is not enabled in your browser.');
    }
}

function successFunction(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    
    alert('Your latitude is :' + lat + ' and longitude is ' + long);
    
    $("#starting").text(lat + ", " + long);
    $("#starting").val(lat + ", " + long);

    /*
    $.getJSON("/location", {
        lat: lat,
        lon: long,
        format: "json"
    }, function (data) {
        console.log(data);
        $("#starting").val(data.location[0].formattedAddress);

        //$("#location-button").stopRotate(); // stop rotation
        //$("#location-button").css("transform", ""); // clear rotation
        //$("#location-button").css("-webkit-transform", "");
    });
    */
}

function errorFunction(position) {
    alert("Couldn't get your location!");
}