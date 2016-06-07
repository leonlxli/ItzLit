    (function($) {
      "use strict";
      
        var data=[];
        var pie_data = [];

        function getCount(data){
          return new Promise(function(resolve, reject){
            $.get("/getCountCrimeData", function(response){
                  data.push(response);
                  resolve();
            });
          });
        }



        var promises = [];
          promises.push(getCount(data));
        

        var total = 0;

        Promise.all(promises).then(function(){


        var origCount = [];

        for(var a=0;a<data[0].length;a++){
          origCount.push(data[0][a].count);
          total=total+parseInt(data[0][a].count); // simple logic to calculate total of data count value
        }

        for( var a=0;a<data[0].length;a++){ // simple logic to calculate percentage data for the pie
          pie_data[a]={"count": (data[0][a].count/total)*100, "label": data[0][a].label};

          // pie_data[a] = data[0][a].count;
        }
              var margin = {top: 20, right: 40, bottom: 120, left: 80},
                    width = 600 - margin.right - margin.left,
                    height = 600 - margin.top - margin.bottom;
              var radius = Math.min(width, height) / 2;
              var donutWidth = 95; 
              var legendRectSize = 18;
              var legendSpacing = 4;

            // var color = d3.scale.ordinal()
            //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var color = d3.scale.category20();

        var svg = d3.select('#pieChart')
            .append("text")
            .attr("class", "title")
            .attr("x", 0)             
            .attr("y", -250)
            .attr("text-anchor", "middle")  
            .style("font-size", "30px") 
            .style("fill", "white")
            // .style("text-decoration", "underline")  
            .text("Breakdown of Crimes")
          .append('svg')
          .attr('width', width + 240)
          .attr('height', height + 60)
          .style('text-align', "center")
          // .style('padding', 20)
          // .style('padding-right', 60)
          .append('g')
          .attr('transform', 'translate(' + (width / 1.9) +
            ',' + (height / 1.8) + ')');

          

        // var pie = d3.layout.pie()
        //   .value(function(d) { return d.count; })
        //   .sort(null);

        var pie = d3.layout.pie()
          .value(function(d,i) { return pie_data[i].count; })
          .sort(null);

        // var div = d3.select("body").append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);

        var tooltip = d3.select("body")
          .append("div")                                                
          .attr("class", "tooltip")          
          .style("opacity", 0);                         
                    
        tooltip.append("div")
          .attr("class", "label")    
          .style("opacity", 0);                                     

        tooltip.append("div")
          .attr("class", "count")
          .style("opacity", 0);   

        tooltip.append("div")
          .attr("class", "percent")
          .style("opacity", 0);   




        var arc = d3.svg.arc()
          .outerRadius(radius)
           .innerRadius(radius - donutWidth);

        var arcHover = d3.svg.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius + 15); 


          //  var path = svg.selectAll('path')
          // .data(pie(pie_data))
          // .enter()
          // .append('path')
          // .attr('d', arc)
          // .attr('fill', function(d, i) { 
          //   return color(i);
          // })

      //var key = function(d){ return d.data.label; };

      var svgContainer = d3.
      select('#pieChart')

  var tooltip = svgContainer                    
          .append('div')                                                
          .attr('class', 'tooltip')
          .attr('id', 'pieChartTip');                                                        
    var tooltipLabel = tooltip.append('div')
          .attr('class', 'label');                                                
     var tooltipCount = tooltip.append('div')
          .attr('class', 'count');       

  var tooltipPercent = tooltip.append('div')
          .attr('class', 'percent'); 


        var path = svg.selectAll('path').
            data(pie(pie_data))
            .enter()
            .append('path')
            .attr('d', arc)
          .attr('class', 'path')
            .attr('fill', function(d,i){
             return color(d.data.label);})
             .on('mouseover', function(d,i) {
                var total = d3.sum(data.map(function(d,i) {
                      return d[i].count;
                   })); 
                // var percent = Math.round(1000 * d.data.count / total) / 10;
                    tooltipLabel.text(d.data.label);
                    tooltipCount.text(origCount[i]); 
                    tooltipPercent.text(d.data.count.toFixed(2) + '%'); 
                    tooltip.style("opacity", 1); 
                 d3.select(this).transition()
                  .duration(500)
                  .attr("d", arcHover);
                   var total = d3.sum(data.map(function(d) {
                      return d.count;
                   })); 
                   }).       
                on('mouseout', function() {
                 d3.select(this).transition()
                  .duration(500)
                  .attr("d", arc);      
                    // tooltip.style('display', 'none'); 
                    tooltip.style("opacity", 0);                   
                  });

        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var height = legendRectSize + legendSpacing;
              var offset =  height * color.domain().length / 2;
              // var horz = -2 * legendRectSize;
              var horz = width/2 + 20;
              var vert = i * height - offset;
              return 'translate(' + horz + ',' + vert + ')';
            });

          legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)                                   
            .style('fill', color)
            .style('stroke', color);
            
          legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .style("font-size", "16px")
            .text(function(d) { return d; });

        })
}) ($);