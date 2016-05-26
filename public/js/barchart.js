
(function($) {
  "use strict";
    
    var data = [];

    function getHourData(count, data){
      return new Promise(function(resolve, reject){
        $.get("/getTimeBarCrimeData?time="+count, function(response){
          data.push(response);
          resolve();
        });
      });
    }

    var promises = [];
    for(var i=0; i<24; i++) {
      promises.push(getHourData(i, data));
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
              height = 450 - margin.top - margin.bottom;

          var innerWidth  = width  - margin.left - margin.right;
          var innerHeight = height - margin.top  - margin.bottom;

          var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.6);
          var yScale = d3.scale.linear().range([height, 0]);
          // var color = d3.scale.ordinal()
            // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
          var color = d3.scale.category10(); // Preset category of colors

          var stackBarChart = d3
            .select("#stackBarChart")
            .append("svg")
            .attr("viewBox", "0 0 980 450")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" +  margin.left + "," + margin.right + ")");

          color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "hour";
          }));

          data.forEach(function (d) {
            var y0 = 0;

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

          stackBarChart
            .selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) { return xScale(d.hour); })
            .attr("width", xScale.rangeBand())
            .style('fill', 'white')
            .attr("y", function(d) { return yScale(d.total); })
            .attr("height", function(d) { return height - yScale(d.total); });
            
          // Orient the x and y axis
          var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
          var yAxis = d3.svg.axis().scale(yScale).orient("left");

          // Append X axis
          stackBarChart
            .append("g")
            .attr("class", "xaxis axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .style('fill', 'white')
            .append("text")
                .attr("y", 30)
                .attr("x", width)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style('fill', 'white')
                .text("Time of Day by Hour");
            // .selectAll(".xaxis text") // To rotate axis text
                // .style("text-anchor", "end")
                // .attr("dx", "-1em")
                // .attr("dy", ".3em");
                // .attr("transform", "rotate(-65)");

          // Append Y axis
          stackBarChart
            .append("g")
            .attr("class", "yaxis axis")
            .call(yAxis)
            .style('fill', 'white')
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".5em")
                .style("text-anchor", "end")
                .style('fill', 'white')
                .text("Number of Crimes");


            
          var hour = stackBarChart.selectAll(".hour")
            .data(data)
            .enter().append("g")
            .attr("class", "hour")
            .attr("transform", function(d) {
              return "translate(" + xScale(d.hour) + ",0)";
          });

          // For stacking
          var dynamicColor;

          hour.selectAll("rect")
            .data(function(d) { return d.rates; })
            .enter().append("rect")
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.y1); })
            .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
            .style("fill", function(d) { return color(d.type); });


            
            stackBarChart.selectAll("rect")
              .on("mouseover", function(d){
                // console.log("x", d3.select(this).attr("x"));
                // console.log("y", d3.select(this).attr("y"));
                //   var xPos = parseFloat(d3.select(this).attr("x"));
                //   var yPos = parseFloat(d3.select(this).attr("y"));
                //   var height = parseFloat(d3.select(this).attr("height"))
                          
                  d3.select(this).attr("stroke","yellow").attr("stroke-width",2.0);             
                  // console.log(xPos);
                  // console.log(yPos);
                  stackBarChart.append("text")
                  // .attr("class","tooltip")
                  //   .attr("x",xPos)
                  //   .attr("y",yPos +height/2)
                    // .attr("x", 50);
                    // .attry("y", 100);
                    //.text(Math.floor(d.y_pct.toFixed(2)*100) + "% population of " + d.mystate );    
                    // .text(d);
                    // .text("Number of " + function(d) { return d.type; } + "s: " + function(d) { return yScale(d.y0) - yScale(d.y1); });  
              })
              .on("mouseout",function(){
                stackBarChart.select(".tooltip").remove();
                d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);
                                      
              })

            var legend = stackBarChart.selectAll(".legend")
                .data(color.domain().slice().reverse())
              .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(55," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width + 87)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width + 83)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; })
                .style('fill', 'white');

            // var tooltip = d3.select("body")
            //   .append("div")
            //   .style("position", "absolute")
            //   .style("z-index", "10")
            //   .style("visibility", "hidden")
            //   .text("sample text")
            // .on("mouseover", function(){return tooltip.style("visibility", "visible");})
            // .on("mousemove", function(){return tooltip.style("top",
            //     (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            // .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    });
 })($);