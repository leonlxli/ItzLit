var map;
var allData;
var infoWindow;
var tooltip;

/*d3.json("/getRankedData?uber=UberX", function(err, dat) {
    allData = dat.SortedData;
    // console.log(allData);
    // console.log(dat.SortedData[0].data['scaled data']);
    // console.log(dat);
});*/

//function that begins at start
$(document).ready(function() {
    //selectUber('UberX');
    $("#all").addClass("selected");

    $('#rankings').children('button').remove();
    $('#rankings').children('div').remove();
    d3.json('/getRankedData?uber=UberX', function(err, dat) {
        allData = dat.SortedData;
        allData.sort(function(a, b) {
            return b.rank - a.rank;
        });
        console.log(allData);
        for (var i = 0; i < 10; i++) {

            // TODO: make it a clickable link that triggers onclick event to pop up d3 graph, as if you clicking on map.
            $('#rankings').append(
                '<button class="ranking list-group-item" onclick="displayRaw(\'' + allData[i].Area + '\')">' + (i + 1) + '. ' + allData[i].Area + '</button>' +
                '<div class="raw container" id="rawData' + i + '"></div>'
            );

        }

        for (var i = 0; i < allData.length; i++) {
            map.data.forEach(function(region) {
                if (region['R']['NAME'] == allData[i].Area.toUpperCase()) {
                    //map.data.overrideStyle(region, {fillColor: getRegionColor(i+1), fillOpacity: 0.5});
                    // map.data.setStyle(function(feature){
                    //   //var color = getRegionColor(i+1);
                    //   return ({ fillColor: getRegionColor(i+1),
                    //               fillOpacity: 0.5,
                    //               strokeWeight: 2  });
                    // });
                    map.data.overrideStyle(region, {
                        fillColor: getRegionColor(i + 1),
                        fillOpacity: 0.5
                    });
                }
            });
        }
    });
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

function selectUber(uber) {

    infoWindow.close();
    /*map.data.forEach(function(region) {
        map.data.overrideStyle(region, {
            fillColor: 'black'
        });
    });*/

    $('#uberTypeSelected').text("for " + uber + ":");

    $('#rankings').children('button').remove();
    $('#rankings').children('div').remove();
    d3.json('/getRankedData?uber=' + uber, function(err, dat) {
        allData = dat.SortedData;
        allData.sort(function(a, b) {
            return b.rank - a.rank;
        });
        console.log(allData);
        for (var i = 0; i < 10; i++) {

            // TODO: make it a clickable link that triggers onclick event to pop up d3 graph, as if you clicking on map.
            $('#rankings').append(
                '<button class="ranking list-group-item" onclick="displayRaw(\'' + allData[i].Area + '\')">' + (i + 1) + '. ' + allData[i].Area + '</button>' +
                '<div class="raw container" id="rawData' + i + '"></div>'
            );

        }

        for (var i = 0; i < allData.length; i++) {
            map.data.forEach(function(region) {
                console.log(region);
                if (region['H']['NAME'] == allData[i].Area.toUpperCase()) {
                    map.data.overrideStyle(region, {
                        fillColor: getRegionColor(i + 1),
                        fillOpacity: 0.5
                    });
                }
            });
        }
    });
}

function displayRaw(area) {
    $('.raw').children('p').remove();
    $('.raw').children('br').remove();

    infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
        content: '<div class="scrollFix"></div>'
    });
    cityName = area;
    for (i = 0; i < allData.length; i++) {
        //console.log(cityName);
        //buildGraph(cityName, infoWindow);
        if (cityName.toUpperCase() == allData[i].Area.toUpperCase()) {
            console.log(allData[i]);
            // Render Data for bar graphs
            // console.log(allData[i].data['scaled data']);
            var bars = buildGraph(allData[i]);

        }
    }
    var html = "<p>" + cityName + "</p>";
    var d3 = $('#d3').html();
    // console.log(d3);
    var lat;
    var lng;
    var latlng;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': cityName + ', san diego us'
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            console.log(lat);
            console.log(lng);
            latlng = new google.maps.LatLng(lat, lng);
            infoWindow.setPosition(latlng);
        } else {
            console.log("ERROR");
        }
    });

    console.log(lat);
    console.log(lng);

    console.log(latlng);

    var rawData;

    for (var i = 0; i < 10; i++) {
        if (allData[i].Area == area) {
            var raw = allData[i].data;
            // console.log(raw);
            /* $('#rawData' + i.toString()).append(
              '<br />' +
              '<p><strong> Population: </strong>' + raw['population'] + '</p>' +
              '<p><strong> Median income: </strong>' + raw['Median income'] + '</p>' +
              '<p><strong> Family Households With Children: </strong>' + raw['Family Households With Children'] + '</p>' +
              '<p><strong> Hispanic Population: </strong>' + raw['Hispanic Population'] + '</p>' +
              '<p><strong> Families without vehicles: </strong>' + raw['Families without vehicles'] + '</p>' +
              '<p><strong> Families with only 1 vehicle: </strong>' + raw['Families with only 1 vehicle'] + '</p>' +
              '<p><strong> Number of people working in this region: </strong>' + raw['Number of people working in this region'] + '</p>'
            );*/
            rawData =
                '<div class="row">' +
                '<br />' +
                '<p class="col-md-6"><strong> Population: </strong>' + raw['population'] + '</p>' +
                '<p class="col-md-6"><strong> Median income: </strong>' + raw['Median income'] + '</p>' +
                '<p class="col-md-6"><strong> Family Households With Children: </strong>' + raw['Family Households With Children'] + '</p>' +
                '<p class="col-md-6"><strong> Hispanic Population: </strong>' + raw['Hispanic Population'] + '</p>' +
                '<p class="col-md-6"><strong> Families without vehicles: </strong>' + raw['Families without vehicles'] + '</p>' +
                '<p class="col-md-6"><strong> Families with only 1 vehicle: </strong>' + raw['Families with only 1 vehicle'] + '</p>' +
                '<p class="col-md-6"><strong> Number of people working in this region: </strong>' + raw['Number of people working in this region'] + '</p>' +
                '</div>';
        }
    }

    infoWindow.setContent('<div class="scrollFix">' + html + d3 + rawData + '</div>');
    infoWindow.open(map);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


function getRegionColor(scale) {
    var R = 0;
    var G = 0;
    var B = 0;
    if (scale <= 5) {
        // R = 0;
        G = 255;
    }
    // else if (scale <=20 && scale > 10) {
    //     R = 20;
    //     G = 180;
    // }
    // else if (scale <=30 && scale > 20) {
    //     R = 50;
    //     G = 100;
    // }
    // else if (scale <=41 && scale > 30) {
    //     R = 255;
    // }
    else if (scale <= 10 && scale > 5) {
        G = 210;
    } else if (scale <= 15 && scale > 10) {
        G = 170;
    } else if (scale <= 20 && scale > 15) {
        // R = 40;
        G = 130;
    } else if (scale <= 25 && scale > 20) {
        // R = 90;
        G = 90;
    } else if (scale <= 30 && scale > 25) {
        R = 130;
        G = 50;
    } else if (scale <= 35 && scale > 30) {
        R = 170;
        G = 10;
    } else if (scale <= 40 && scale > 35) {
        R = 210;
    } else if (scale <= 42 && scale > 40) {
        R = 255;
    }

    // var R = Math.floor((255 * (100/scale))/ 100);
    // var G = Math.floor((255 * (100 - (100/scale))) / 100);
    // var B = 0;
    return rgbToHex(R, G, B);
}

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



    // chart.selectAll("text")
    //    .data(obj, 12)
    //    .enter()
    //    .append("text")
    //    .text(function(d) {
    //    return d.value;
    //    })
    //    .attr("text-anchor", "middle")
    //    .attr("x", function(d, i) {
    //    return xScale(i) + xScale.rangeBand() / 2;
    //    })
    //    .attr("y", function(d) {
    //    return h - yScale(d.value) + 14;
    //    })
    //    .attr("font-family", "sans-serif")
    //    .attr("font-size", "11px")
    //    .attr("fill", "white");

    return chart;
}


window.initMap = function() {

    var minZoomLevel = 9;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: minZoomLevel,
        center: new google.maps.LatLng(32.8787, -117.0400),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        zoomControl: false,
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


    var styleArray = [{
        featureType: "all",
        stylers: [{
            saturation: -80
        }]
    }, {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{
            hue: "#00ffee"
        }, {
            saturation: 50
        }]
    }, {
        featureType: "poi.business",
        elementType: "labels",
        stylers: [{
            visibility: "off"
        }]
    }];

    map.setOptions({
        styles: styleArray
    });


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
            map.setCenter({
                lat: 32.8787,
                lng: -117.0400
            });
            map.setZoom(minZoomLevel);
        });

    }

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    var meter = new Image();
    meter.src = '../images/meter.png';

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(meter);
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
    google.maps.event.addListener(map, 'zoom_changed', function() {
        if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
    });

    var cityName;
    map.data.loadGeoJson('./map/sdcounty.json');

    infoWindow = new google.maps.InfoWindow({

    });
    // Creates the infoWindow object

    google.maps.event.addListener(map, 'click', function(event) {
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({
            content: '<div class="scrollFix"></div>'
        });
        var html = "<center><p>Please click on an outlined<br>region for data!</p></center>";
        infoWindow.setContent(html);
        var latlng = event.latLng;
        //console.log(latlng);
        infoWindow.setPosition(latlng);
        infoWindow.open(map);
    });

    map.data.addListener('click', function(event) {
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({
            content: '<div class="scrollFix"></div>'
        });

        var rawData;
        cityName = event.feature.getProperty('NAME');
        for (i = 0; i < allData.length; i++) {
            if (cityName.toUpperCase() == allData[i].Area.toUpperCase()) {
                // Render Data for bar graphs
                // console.log(allData[i].data['scaled data']);
                var bars = buildGraph(allData[i], infoWindow);
                var raw = allData[i].data;

                rawData =
                    '<div class="row">' +
                    '<br />' +
                    '<p class="col-md-6"><strong> Population: </strong>' + raw['population'] + '</p>' +
                    '<p class="col-md-6"><strong> Median income: </strong>' + raw['Median income'] + '</p>' +
                    '<p class="col-md-6"><strong> Family Households With Children: </strong>' + raw['Family Households With Children'] + '</p>' +
                    '<p class="col-md-6"><strong> Hispanic Population: </strong>' + raw['Hispanic Population'] + '</p>' +
                    '<p class="col-md-6"><strong> Families without vehicles: </strong>' + raw['Families without vehicles'] + '</p>' +
                    '<p class="col-md-6"><strong> Families with only 1 vehicle: </strong>' + raw['Families with only 1 vehicle'] + '</p>' +
                    '<p class="col-md-6"><strong> Number of people working in this region: </strong>' + raw['Number of people working in this region'] + '</p>' +
                    '</div>';
            }
        }
        var html = "<p>" + cityName + "</p>";
        var d3 = $('#d3').html();
        // console.log(d3);
        infoWindow.setContent('<div class="scrollFix">' + html + d3 + rawData + '</div>');
        //buildGraph(html, infoWindow);
    })

    // Opens infoWindow on click
    map.data.addListener("click", function(event) {
        infoWindow.close();
        var latlng = event.latLng;
        if (tooltip) {
            tooltip.close();
        }
        infoWindow.setPosition(latlng);
        infoWindow.open(map);
        map.setCenter(infoWindow.getPosition());

    });

    // Closes window when mouseOut
    map.data.addListener("mouseout", function(event) {
        // infoWindow.close();
        if (tooltip) tooltip.close();
        map.data.overrideStyle(event.feature, {
            strokeWeight: 2
        });
    });

    map.data.addListener('mouseover', function(event) {
        tooltip = new google.maps.InfoWindow({
            pixelOffset: new google.maps.Size(0, -10)
        });
        tooltip.setPosition(event.latLng);
        tooltip.setContent('<p>' + event.feature.getProperty('NAME') + '</p><p> Click for more Information</p>');
        tooltip.open(map);
        map.data.overrideStyle(event.feature, {
            strokeWeight: 6
        });
    });
    map.data.addListener('mousemove', function(event) {
        tooltip.setPosition(event.latLng);
    });
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
