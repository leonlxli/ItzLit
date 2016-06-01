(function($) {
  "use strict";
    
    var data = [];

    // var functionNames = ['getTimeBarCrimeData1', 'getTimeBarCrimeData2', 'getTimeBarCrimeData3', 'getTimeBarCrimeData4', 'getTimeBarCrimeData5', 'getTimeBarCrimeData6', 'getTimeBarCrimeData7', 'getTimeBarCrimeData8', 'getTimeBarCrimeData9', 'getTimeBarCrimeData10'];

    function getHourData(name, count, data){
      return new Promise(function(resolve, reject){
        //$.get("/getTimeBarCrimeData1?time="+count, function(response){
        $.get(name+count, function(response){
          data.push(response);
          resolve();
        });
      });
    }

    var promises = [];
    for(var i=0; i<24; i++) {
      promises.push(getHourData("/getTimeBarCrimeDataArson?time=", i, data));
    }


    function compare(a,b) {
      if (Number(a.hour) < Number(b.hour))
        return -1;
      else if (Number(a.hour) > Number(b.hour))
        return 1;
      else 
        return 0;
    }

Promise.all(promises).then(function(){
          console.log("Data", data);

          data.sort(compare);

          var margin = {top: 20, right: 80, bottom: 100, left: 50},
              width = 900 - margin.right - margin.left, // Originally 960
              height = 550 - margin.top - margin.bottom;

          var innerWidth  = width  - margin.left - margin.right;
          var innerHeight = height - margin.top  - margin.bottom;

          var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.6);
          var yScale = d3.scale.linear().range([height, 0]);
          // var color = d3.scale.ordinal()
            // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
          var color = d3.scale.category10();// Preset category of colors

          d3.select("svg").remove();

          var barChart = d3
            .select("#barChart")
            .append("svg")
            .attr("viewBox", "0 0 980 550")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" +  margin.left + "," + margin.right + ")");

          color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "hour";
          }));

          data.forEach(function (d) {
            var y0 = 0;

            d.rates = [];
            console.log("rates", d.rates);
            // d.rates = color.domain().map(function (type) {
            d.rates = color.domain().map(function (type) {
              var temp;
              if ( d[type] == undefined ) {
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
            console.log("rates",d.rates);
            console.log("d.rates.length-1", d.rates.length-1);
            console.log("d.rates[d.rates.length-1]", d.rates[d.rates.length-1]);
            console.log("total", d.total);

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
          xScale.domain(data.map(function (d){ return d.hour; }));
          yScale.domain([0, d3.max(data, function(d) { return d.total; })]);

          barChart
            .selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) { return xScale(d.hour); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.total); })
            .attr("height", function(d) { return height - yScale(d.total); });
            
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
            // .selectAll(".xaxis text") // To rotate axis text
                // .style("text-anchor", "end")
                // .attr("dx", "-1em")
                // .attr("dy", ".3em");
                // .attr("transform", "rotate(-65)");

          // Append Y axis
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

            // barChart
            //     .exit()
            //     .transition()
            //       .duration(300)
            //     .attr("y", y(0))
            //     .attr("height", height - y(0))
            //     .style('fill-opacity', 1e-6)
            //     .remove();

          var hour = barChart.selectAll(".hour")
            .data(data)
            .enter().append("g")
            .attr("class", "hour")
            .attr("transform", function(d) {
              return "translate(" + xScale(d.hour) + ",0)";
          });

          // For stacking
          // var dynamicColor;

          hour.selectAll("rect")
            .data(function(d) { return d.rates; })
            .enter().append("rect")
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.y1); })
            .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
            .style("fill", function(d) { return color(d.type); });
    });

window.loadData = function update(error, data) {
    data = [];
   var crimeName = document.getElementById('crimeName').selectedOptions[0].text;
   crimeName = crimeName.replace(/\s+/g, '');
   var fnPath = "/getTimeBarCrimeData" + crimeName + "?time="
    var promises = [];
    for(var i=0; i<24; i++) {
      promises.push(getHourData(fnPath, i, data));
    }
 
    Promise.all(promises).then(function(){
          console.log("Data", data);

          data.sort(compare);

          var margin = {top: 20, right: 80, bottom: 100, left: 50},
              width = 900 - margin.right - margin.left, // Originally 960
              height = 550 - margin.top - margin.bottom;

          var innerWidth  = width  - margin.left - margin.right;
          var innerHeight = height - margin.top  - margin.bottom;

          var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.6);
          var yScale = d3.scale.linear().range([height, 0]);
          // var color = d3.scale.ordinal()
            // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
          var color = d3.scale.category10();// Preset category of colors

          d3.select("svg").remove()

          var barChart = d3
            .select("#barChart")
            .append("svg")
            .attr("viewBox", "0 0 980 550")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" +  margin.left + "," + margin.right + ")");

          color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "hour";
          }));

          data.forEach(function (d) {
            var y0 = 0;

            d.rates = [];
            console.log("rates", d.rates);
            // d.rates = color.domain().map(function (type) {
            d.rates = color.domain().map(function (type) {
              var temp;
              if ( d[type] == undefined ) {
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
            console.log("rates",d.rates);
            console.log("d.rates.length-1", d.rates.length-1);
            console.log("d.rates[d.rates.length-1]", d.rates[d.rates.length-1]);
            console.log("total", d.total);

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
          xScale.domain(data.map(function (d){ return d.hour; }));
          yScale.domain([0, d3.max(data, function(d) { return d.total; })]);

          barChart
            .selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) { return xScale(d.hour); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.total); })
            .attr("height", function(d) { return height - yScale(d.total); });
            
          // Orient the x and y axis
          var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
          var yAxis = d3.svg.axis().scale(yScale).orient("left");

          // Append X axis
          barChart
            .append("g")
            .attr("class", "xaxis axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .style('stroke', 'white')
            .style('fill', 'white')
            .append("text")
                .attr("y", 30)
                .attr("x", width)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style('stroke', 'white')
                .style('fill', 'white')
                .text("Hour of the Day");
            // .selectAll(".xaxis text") // To rotate axis text
                // .style("text-anchor", "end")
                // .attr("dx", "-1em")
                // .attr("dy", ".3em");
                // .attr("transform", "rotate(-65)");

          // Append Y axis
          barChart
            .append("g")
            .attr("class", "yaxis axis")
            .call(yAxis)
            .style('stroke', 'white')
            .style('fill', 'white')
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

          // For stacking
          // var dynamicColor;

          hour.selectAll("rect")
            .data(function(d) { return d.rates; })
            .enter().append("rect")
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.y1); })
            .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
            .style("fill", function(d) { return color(d.type); });
    });
}
}) ($);