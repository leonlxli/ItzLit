(function($) {
    "use strict";

    var data = [];

    // var functionNames = ['getTimeBarCrimeData1', 'getTimeBarCrimeData2', 'getTimeBarCrimeData3', 'getTimeBarCrimeData4', 'getTimeBarCrimeData5', 'getTimeBarCrimeData6', 'getTimeBarCrimeData7', 'getTimeBarCrimeData8', 'getTimeBarCrimeData9', 'getTimeBarCrimeData10'];
    function getHourData(name, count, data) {
        return new Promise(function(resolve, reject) {
            //$.get("/getTimeBarCrimeData1?time="+count, function(response){
            $.get(name + count, function(response) {
                data.push(response);
                resolve();
            });
        });
    }

    var promises = [];
    for (var i = 0; i < 24; i++) {
        promises.push(getHourData("/getTimeBarCrimeDataArson?time=", i, data));
    }


    function compare(a, b) {
        if (Number(a.hour) < Number(b.hour))
            return -1;
        else if (Number(a.hour) > Number(b.hour))
            return 1;
        else
            return 0;
    }

    Promise.all(promises).then(function() {

        data.sort(compare);

        var margin = {
                top: 20,
                right: 80,
                bottom: 100,
                left: 50
            },
            width = 900 - margin.right - margin.left, // Originally 960
            height = 550 - margin.top - margin.bottom;

        var innerWidth = width - margin.left - margin.right;
        var innerHeight = height - margin.top - margin.bottom;

        var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.6);
        var yScale = d3.scale.linear().range([height, 0]);
        // var color = d3.scale.ordinal()
        // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        var color = d3.scale.category10(); // Preset category of colors
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var barChart = d3
            .select("#barChart")
            .append("svg")
            .attr("viewBox", "0 0 980 550")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

        color.domain(d3.keys(data[0]).filter(function(key) {
            return key !== "hour";
        }));

        data.forEach(function(d) {
            var y0 = 0;

            d.rates = [];
            // d.rates = color.domain().map(function (type) {
            d.rates = color.domain().map(function(type) {
                var temp;
                if (d[type] == undefined) {
                    temp = 0;
                } else {
                    temp = +d[type];
                }

                return {
                    type: type,
                    y0: y0,
                    y1: y0 += temp
                };
            })
            d.total = d.rates[d.rates.length - 1].y1;

        });
        console.log(data)

        // var x = d3.scale.linear().domain([0, data.length]).range([0, w]);


        //     var y = d3.scale.linear()
        //         .range([height, 0]);

        xScale.domain(data.map(function(d) {
            return d.hour;
        }));
        yScale.domain([0, d3.max(data, function(d) {
            return d.total;
        })]);

        var line = d3.svg.line()
            .x(function(d) {
                return xScale(d.hour);
            })
            .y(function(d) {
                return yScale(d.total);
            });


        // Orient the x and y axis
        var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
        var yAxis = d3.svg.axis().scale(yScale).orient("left");

        // Append X axis
        barChart
            .append("g")
            .attr("class", "xaxis axis")
            .attr("transform", "translate(0," + height + ")")
            .style("stroke", "white")
            .style("fill", "white")
            .call(xAxis)
            .append("text")
            .attr("y", 30)
            .attr("x", width)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("stroke", "white")
            .style("fill", "white")
            .text("Hour of the Day");

        barChart
            .append("g")
            .attr("class", "yaxis axis")
            .style("stroke", "white")
            .style('fill', 'white')
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".5em")
            .style("text-anchor", "end")
            .style("stroke", "white")
            .style("fill", "white")
            .text("Frequency of Crimes");


        var hour = barChart.selectAll(".hour")
            .data(data)
            .enter().append("g")
            .attr("class", "hour")
            .attr("transform", function(d) {
                return "translate(" + xScale(d.hour) + ",0)";
            });

        barChart.append("path")
            .datum(data)
            .attr("id", "myPath")
            .attr("class", "line")
            .attr("d", line)
            .call(yAxis)
            .append("text")
            .attr("y", 6)
            .attr("dy", ".5em");

        var title;
        var keys = Object.keys(data[0])
        for (var i in keys) {
            if (keys[i] != "hour" && keys[i] != "rates" && keys[i] != "total") {
                title = keys[i]
            }
        }

        barChart.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "30px")
            .text("\"" + title + "\" frequency over time");

        barChart.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .style("fill", "white")
            .attr("r", 5)
            .attr("cx", function(d) {
                return xScale(d.hour);
            })
            .attr("cy", function(d) {
                return yScale(d.total);
            })
            .on("mouseover", function(d) {
                console.log(d)
                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                var crimeTime;
                if (d.hour == 0) {
                    crimeTime = "12AM"
                } else if (d.hour == 12) {
                    crimeTime = "12PM"
                } else if (d.hour > 12) {
                    crimeTime = d.hour % 12 + "PM"
                } else {
                    crimeTime = d.hour + "AM"
                }
                div.html(d.total + " reported at " + crimeTime)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        // var focus = barChart.append("g")
        //     .attr("class", "focus")
        //     .style("display", "none");

        // focus.append("circle")
        //     .attr("r", 4.5);

        // focus.append("text")
        //     .attr("x", 9)
        //     .attr("dy", ".35em");

        // barChart.append("rect")
        //     .attr("class", "overlay")
        //     .attr("width", width + margin.right + margin.left)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .on("mouseover", function() {
        //         focus.style("display", null);
        //     })
        //     .on("mouseout", function() {
        //         focus.style("display", "none");
        //     })
        //     .on("mousemove", mousemove);

        // function mousemove() {
        //     // var x0 = xScale.invert(d3.mouse(this)[0]),
        //     //     i = bisectDate(data, x0, 1),
        //     //     d0 = data[i - 1],
        //     //     d1 = data[i],
        //     //     d = x0 - d0.hour > d1.hour - x0 ? d1 : d0;
        //     // focus.attr("transform", "translate(" + x(d.hour) + "," + y(d.close) + ")");
        //     // focus.select("text").text("hello");
        // }
    });

    window.loadData = function update(error, data) {
        data = [];
        var crimeName = document.getElementById('crimeName').selectedOptions[0].text;
        crimeName = crimeName.replace(/\s+/g, '');
        var fnPath = "/getTimeBarCrimeData" + crimeName + "?time="
        var promises = [];
        for (var i = 0; i < 24; i++) {
            promises.push(getHourData(fnPath, i, data));
        }

        Promise.all(promises).then(function() {

            data.sort(compare);

            var margin = {
                    top: 20,
                    right: 80,
                    bottom: 100,
                    left: 50
                },
                width = 900 - margin.right - margin.left, // Originally 960
                height = 550 - margin.top - margin.bottom;

            var innerWidth = width - margin.left - margin.right;
            var innerHeight = height - margin.top - margin.bottom;

            var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.6);
            var yScale = d3.scale.linear().range([height, 0]);
            // var color = d3.scale.ordinal()
            // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
            var color = d3.scale.category10(); // Preset category of colors

            d3.select("svg").remove()
            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            var barChart = d3
                .select("#barChart")
                .append("svg")
                .attr("viewBox", "0 0 980 550")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

            var title;
            var keys = Object.keys(data[0])
            for (var i in keys) {
                if (keys[i] != "hour" && keys[i] != "rates" && keys[i] != "total") {
                    title = keys[i]
                }
            }

            barChart.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", "30px")
                .text("\"" + title + "\" frequency over time");


            color.domain(d3.keys(data[0]).filter(function(key) {
                return key !== "hour";
            }));

            data.forEach(function(d) {
                var y0 = 0;

                d.rates = [];
                // d.rates = color.domain().map(function (type) {
                d.rates = color.domain().map(function(type) {
                    var temp;
                    if (d[type] == undefined) {
                        temp = 0;
                    } else {
                        temp = +d[type];
                    }

                    return {
                        type: type,
                        y0: y0,
                        y1: y0 += temp
                    };
                })
                d.total = d.rates[d.rates.length - 1].y1;

                // d.rates.forEach(function (d) { // Leave these 4 lines out
                //   d.y0 /= y0;
                //   d.y1 /= y0;
                // });
                // console.log("y0 is " + d.y0);
            });

            // data.sort(function (a, b) {
            //   return b.rates[0].y1 - a.rates[0].y1;
            // });

            // Render the chart
            xScale.domain(data.map(function(d) {
                return d.hour;
            }));
            yScale.domain([0, d3.max(data, function(d) {
                return d.total;
            })]);

            var line = d3.svg.line()
                .x(function(d) {
                    return xScale(d.hour);
                })
                .y(function(d) {
                    return yScale(d.total);
                });


            // Orient the x and y axis
            var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
            var yAxis = d3.svg.axis().scale(yScale).orient("left");

            // Append X axis
            barChart
                .append("g")
                .attr("class", "xaxis axis")
                .attr("transform", "translate(0," + height + ")")
                .style("stroke", "white")
                .style("fill", "white")
                .call(xAxis)
                .append("text")
                .attr("y", 30)
                .attr("x", width)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("stroke", "white")
                .style("fill", "white")
                .text("Hour of the Day");

            barChart
                .append("g")
                .attr("class", "yaxis axis")
                .style("stroke", "white")
                .style('fill', 'white')
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".5em")
                .style("text-anchor", "end")
                .style("stroke", "white")
                .style("fill", "white")
                .text("Quantity of Crimes");


            var hour = barChart.selectAll(".hour")
                .data(data)
                .enter().append("g")
                .attr("class", "hour")
                .attr("transform", function(d) {
                    return "translate(" + xScale(d.hour) + ",0)";
                });

            barChart.append("path")
                .datum(data)
                .attr("id", "myPath")
                .attr("class", "line")
                .attr("d", line)
                .call(yAxis)
                .append("text")
                .attr("y", 6)
                .attr("dy", ".5em");

            barChart.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .style("fill", "white")
                .attr("r", 5)
                .attr("cx", function(d) {
                    return xScale(d.hour);
                })
                .attr("cy", function(d) {
                    return yScale(d.total);
                })
                .on("mouseover", function(d) {
                    console.log(d)
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);

                    var crimeTime;
                    if (d.hour == 0) {
                        crimeTime = "12AM"
                    } else if (d.hour == 12) {
                        crimeTime == "12PM"
                    } else if (d.hour > 12) {
                        crimeTime = d.hour % 12 + "PM"
                    } else {
                        crimeTime = d.hour + "AM"
                    }
                    div.html(d.total + " at " + crimeTime)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });
    }
})($);

$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) { // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200); // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200); // Else fade out the arrow
    }
});

$('#return-to-top').click(function() { // When arrow is clicked
    $('body,html').animate({
        scrollTop: 0 // Scroll to top of body
    }, 500);
})