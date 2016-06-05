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
          console.log("dataData", data);
            console.log("PieData", pie_data);

        for(var a=0;a<data[0].length;a++){
          console.log("datao-o", data);
          console.log("datacount", data[0][a].count);
          total=total+parseInt(data[0][a].count); // simple logic to calculate total of data count value
          console.log(total);
        }

        for( var a=0;a<data[0].length;a++){ // simple logic to calculate percentage data for the pie
          pie_data[a]={"count": (data[0][a].count/total)*100, "label": data[0][a].label};

          // pie_data[a] = data[0][a].count;
          console.log("each pie",pie_data[a]);
        }
              var width = 360;
              var height = 360;
              var radius = Math.min(width, height) / 2;

            // var color = d3.scale.ordinal()
            //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var color = d3.scale.category10();

        var svg = d3.select('#pieChart')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) + 
            ',' + (height / 2) + ')');

        // var pie = d3.layout.pie()
        //   .value(function(d) { return d.count; })
        //   .sort(null);

        var pie = d3.layout.pie()
          .value(function(d,i) { return pie_data[i].count; })
          .sort(null);

        // var pie = d3.layout.pie()
        //   .value(function(d,i) { return pie_data[i]; })
        //   .sort(null);

        var arc = d3.svg.arc()
          .outerRadius(radius);
          // .innerRadius(radius - 50);

          //  var path = svg.selectAll('path')
          // .data(pie(pie_data))
          // .enter()
          // .append('path')
          // .attr('d', arc)
          // .attr('fill', function(d, i) { 
          //   return color(i);
          // })

      var key = function(d){ return d.data.label; };

        var path = svg.selectAll('path')
          .data(pie(pie_data))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) { 
            console.log("datalabel",d.data.label);
            return color(d.data.label);
          })
          .append("g")
          .attr("class", "labels")
          .append("g")
          .attr("class", "lines");
            //   .append("text")
            //   .attr("transform", function(d,i) { 
            //     console.log("dataeee", d.data.count);
            //     return "translate(" + arc.centroid(d.data.count) + ")"; })
            // .attr("dy", ".35em")
            // .attr("text-anchor", "middle")                          //center the text on its origin
            // // .style("stroke", "white")
            // // .style("fill", "white")
            // .text(function(d, i) { return pie_data[i].label; });  

            var text = svg.select(".labels").selectAll("text")
                .data(pie(pie_data), key);

              text.enter()
                .append("text")
                .attr("dy", ".35em")
                .text(function(d) {
                  return d.data.label;
                });
              
              function midAngle(d){
                return d.startAngle + (d.endAngle - d.startAngle)/2;
              }


  // text.transition().duration(1000)
  //   .attrTween("transform", function(d) {
  //     this._current = this._current || d;
  //     var interpolate = d3.interpolate(this._current, d);
  //     this._current = interpolate(0);
  //     return function(t) {
  //       var d2 = interpolate(t);
  //       var pos = outerArc.centroid(d2);
  //       pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
  //       return "translate("+ pos +")";
  //     };
  //   })
  //   .styleTween("text-anchor", function(d){
  //     this._current = this._current || d;
  //     var interpolate = d3.interpolate(this._current, d);
  //     this._current = interpolate(0);
  //     return function(t) {
  //       var d2 = interpolate(t);
  //       return midAngle(d2) < Math.PI ? "start":"end";
  //     };
  //   });

  // text.exit()
  //   .remove();

    var polyline = svg.select(".lines").selectAll("polyline")
    .data(pie(data), key);
  
  polyline.enter()
    .append("polyline");

  // polyline.transition().duration(1000)
  //   .attrTween("points", function(d){
  //     this._current = this._current || d;
  //     var interpolate = d3.interpolate(this._current, d);
  //     this._current = interpolate(0);
  //     return function(t) {
  //       var d2 = interpolate(t);
  //       var pos = outerArc.centroid(d2);
  //       pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
  //       return [arc.centroid(d2), outerArc.centroid(d2), pos];
  //     };      
  //   });
  
  // polyline.exit()
  //   .remove();

        })
}) ($);