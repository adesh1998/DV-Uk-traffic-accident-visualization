
d3.csv("accidents_2005_to_2007.csv", function(error, data) {

d3.json("uk.json", function(error, uk) {

    var width = 960,
    height = 1050;

    var markerLayer;

    var svg = d3.select("#geometry")
            .attr("width", width)
            .attr("height", height);
    if (error) return console.error(error);

    var subunits = topojson.feature(uk, uk.objects.subunits);

    var projection = d3.geo.albers()
                        .center([0, 55.4    ])
                        .rotate([4.4, 0])
                        .parallels([50, 60])
                        .scale(6000)
                        .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
                        
    var path = d3.geo.path()
                    .projection(projection);

    svg.append("path")
        .datum(subunits)
        .attr("d", path)
        .attr("class", "areas");
    
    
   
    // years = d3.extent(data, d => d.Year)
    // dataInitial = data.filter(d => d.Year === years[0])
    dataInitial = data.filter(function(d) {
        
        return d.Year < 2006;
        })

   
    var keys = d3.map(dataInitial, function(d){return(d.Accident_Severity)}).keys()
        
    //console.log(d3.map(dataInitial, function(d){return(d.Accident_Severity)}))
       
    var colorScale = d3.scale.ordinal()
                        .domain(keys)
                        .range(["#800000","	#FF6666","#FFCCCC"])

// Add one dot in the legend for each name.
    svg.selectAll("mydots")
            .data(["High","Medium","Low"])
            .enter()
            .append("circle")
            .attr("cx", 100)
            .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 8)
            .style("fill", function(d){ return colorScale(d)})
            .on('mouseover', function(d) {
               x= d3.selectAll("circle")
                    .transition()
                    .duration('50')
                    .attr('opacity', '.2');

                d3.select(this)
                    .transition()
                    .duration('50')
                    .attr('opacity', '1');
                
               console.log(x)

                var count1 = 0;
                var count2=0;
                var count3=0;

                for (let index = 0; index < x._groups[0].length; index++) {
                    let element = x._groups[0][index].__data__.Accident_Severity
                    
                    if (element === "1") {  
                        const f = x._groups[0][index]
                        console.log(element) 
                       
                        d3.selectAll(f)
                        .transition()
                        .duration('50')
                        .attr('opacity', '3')

                        count1 = count1 + 1;
                    }
                    if (element === "2") {   
                        const f = x._groups[0][index]
                        d3.selectAll(f)
                        .transition()
                        .duration('50')
                        .attr('opacity', '3')

                        count2 = count2 + 1;
                    }
                    if (element === "3") {   
                        const f = x._groups[0][index]
                        d3.selectAll(f)
                        .transition()
                        .duration('50')
                        .attr('opacity', '3')

                        count3 = count3 + 1;
                    }
                }
                console.log(count1)
                console.log(count2)
                console.log(count3)
            })
            .on('mouseout', function(d) {
            d3.selectAll("circle")
                .transition()
                .duration('50')
                .attr('opacity', '1')
            })

// Add one dot in the legend for each name.
    svg.selectAll("mylabels")
            .data(["High","Medium","Low"])
            .enter()
            .append("text")
                .attr("x", 120)
                .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d){ return "#00000"})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

    
    var Tooltip = d3.select('body')
            .append('div')
            .attr('id', 'tooltip')
            .attr('style', 'position: absolute; opacity: 0;')
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "2px")
                        .style("border-radius", "5px")
               

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
                Tooltip
                .style("opacity", 1)
                d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
  }
  var mousemove = function(d) {
                Tooltip
                .html("Longitude-"+d.Longitude+"<br> Latitude-"+d.Latitude+"<br> Accident Severity-"+d.Accident_Severity+"<br> Number of Vehicles-"+d.Number_of_Vehicles+
                "<br>Number of Casualties-"+d.Number_of_Casualties+"<br> Date-"+d.Date+"<br> Day of Week-"+d.Day_of_Week+"<br>Time-"+d.Time)
                .style("left", (d3.mouse(this)[0]+70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
                Tooltip
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
  }


    var geometry = svg.selectAll("circle")
                        .data(dataInitial)
                        .enter()
                        .append("circle")
                        .attr("cx", function(d) {
                                return projection([d.Longitude, d.Latitude])[0];
                        })
                        .attr("cy", function(d) {
                                return projection([d.Longitude, d.Latitude])[1];
                        })
                        .style("stroke", "none")
                    .style("opacity", 1)
                        .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave)
                        .attr("r", 2)
                        .style("fill", function(d){return colorScale(d.Accident_Severity)})
                        .style("stroke-width", 5)
                        .call(d3.zoom().on("zoom", function () {
                            svg.attr("transform", d3.event.transform)
                         })).append("g")


                       
        
    // var zoom = d3.behavior.zoom()
    //             .on("zoom",function() {
    //                 svg.attr("transform","translate("+ 
    //                     d3.event.translate.join(",")+")scale("+d3.event.scale+")");
    //                 svg.selectAll("circle")
    //                     .attr("d", path.projection(projection));
    //                 svg.selectAll("path")  
    //                     .attr("d", path.projection(projection));   });
    //                     svg.call(zoom)
    
       
      


    function update(selectedOption,Accident_year){
        d3.csv(Accident_year, function(error, data) {
          
                var keys = d3.map(data, function(d){return(d.Accident_Severity)}).keys()
                
         
               
                var colorScale = d3.scale.ordinal()
                        .domain(keys)
                        .range(["#800000","	#FF6666","#FFCCCC"])
                
        
                    // Add one dot in the legend for each name.
                svg.selectAll("mydots")
                        .data(["High","Medium","Low"])
                        .enter()
                        .append("circle")
                        .attr("cx", 100)
                        .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                        .attr("r", 8)
                        .style("fill", function(d){ return colorScale(d)})
                        .on('mouseover', function(d) {
                            d3.selectAll("circle")
                                .transition()
                                .duration('50')
                                .attr('opacity', '0');

                            d3.select(this)
                                .transition()
                                .duration('50')
                                .attr('opacity', '1');
                            
                            var x = d3.selectAll("circle")

                            var count = 0;
                            for (let index = 0; index < x._groups[0].length; index++) {
                                let element = x._groups[0][index].__data__.Accident_Severity
                                
                                if (element === "2") {   
                                    const f = x._groups[0][index]
                                    d3.select(f)
                                    .transition()
                                    .duration('50')
                                    .attr('opacity', '3')

                                    count = count + 1;
                                }
                            }
                            console.log(count)
                        })
                .on('mouseout', function(d) {
                            d3.selectAll("circle")
                                .transition()
                                .duration('50')
                                .attr('opacity', '1')
                            })
                var Tooltip = d3.select('body')
                            .append('div')
                            .attr('id', 'tooltip')
                            .attr('style', 'position: absolute; opacity: 0;')
                                        .style("background-color", "white")
                                        .style("border", "solid")
                                        .style("border-width", "2px")
                                        .style("border-radius", "5px")
                        

  // Three function that change the tooltip when user hover / move / leave a cell
                var mouseover = function(d) {
                                Tooltip
                                .style("opacity", 1)
                                d3.select(this)
                                .style("stroke", "black")
                                .style("opacity", 1)
                }
                var mousemove = function(d) {
                                Tooltip
                                .html("Longitude-"+d.Longitude+"<br> Latitude-"+d.Latitude+"<br> Accident Severity-"+d.Accident_Severity+"<br> Number of Vehicles-"+d.Number_of_Vehicles+
                                "<br>Number of Casualties-"+d.Number_of_Casualties+"<br> Date-"+d.Date+"<br> Day of Week-"+d.Day_of_Week+"<br>Time-"+d.Time)
                                .style("left", (d3.mouse(this)[0]+70) + "px")
                                .style("top", (d3.mouse(this)[1]) + "px")
                }
                var mouseleave = function(d) {
                                Tooltip
                                    .style("opacity", 0)
                                d3.select(this)
                                    .style("stroke", "none")
                                    .style("opacity", 0.8)
                }

                var geometry = svg.selectAll("circle")
                                .data(data)
                                .enter()
                                .append("circle")
                                .attr("cx", function(d) {
                                        return projection([d.Longitude, d.Latitude])[0];
                                })
                                .attr("cy", function(d) {
                                        return projection([d.Longitude, d.Latitude])[1];
                                })
                                .style("stroke", "none")
                                .style("opacity", 0.8)
                                .on("mouseover", mouseover)
                                .on("mousemove", mousemove)
                                .on("mouseleave", mouseleave)
                                .attr("r", 2)
                                
                                .attr("fill", function(d){return colorScale(d.Accident_Severity)})
                            
                var zoom = d3.behavior.zoom()
                                    .on("zoom",function() {
                                        svg.attr("transform","translate("+ 
                                            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
                                        svg.selectAll("circle")
                                            .attr("d", path.projection(projection));
                                        svg.selectAll("path")  
                                            .attr("d", path.projection(projection));   });
                                            svg.call(zoom)
                                    
                                    
                                                
                                            }) 
                svg.selectAll("circle").remove();       
    }
    
       
    

        

    svg.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
        .attr("d", path)
        .attr("class", "subunit-boundary");
    
    svg.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
        .attr("d", path)
        .attr("class", "subunit-boundary IRL");
    
    svg.append("path")
        .datum(topojson.feature(uk, uk.objects.places))
        .attr("d", path)
        .attr("class", "place");

    svg.selectAll(".place-label")
        .data(topojson.feature(uk, uk.objects.places).features)
        .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });

    svg.selectAll(".place-label")
        .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
        .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });

    svg.selectAll(".subunit-label")
        .data(topojson.feature(uk, uk.objects.subunits).features)
        .enter().append("text")
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });



        var pie_data =  data.filter(function(d){ return d.Days != "" })

// On click Listener

    d3.select("#accident").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
       
          if(selectedOption==2005){
        //update Geometry Chart
    update(selectedOption,"Accidents_2005.csv")


    //Barchart onClick Listner for 2005 Year


     
     var maxSum=d3.max(data, function(d) { return d.Casualities_2005; } );
     yScale.domain([
                   0,maxSum
               ])
                
     var yAxis = d3.axisLeft(yScale);
     
     changing_axis.transition().duration(1000).call(yAxis);
     
     bars.on('mouseover', function(d) {
            d3.selectAll("rect")
                .transition()
                .duration('50')
                .attr('opacity', '.5');

            d3.select(this)
                .transition()
                .duration('50')
                .attr('opacity', '1');
            
                tooltipbar.html(`Number of Casualities: `+ d.Casualities_2005)
                .style('visibility', 'visible');
        })
            .on('mousemove', function () {
                tooltipbar.style('top', d3.event.pageY + 10 + 'px')
                        .style('left', d3.event.pageX + 10 + 'px');
            })
            .on('mouseout', function(d) {
            d3.selectAll("rect")
                .transition()
                .duration('50')
                .attr('opacity', '1')
            
                tooltipbar.html(``).style('visibility', 'hidden');
            })
            .transition() 
                .attr("x", function(d) { return xScale(d.Days); })
                .attr("y", function(d) { return yScale(d.Casualities_2005); })
                .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.Casualities_2005); })
                .attr("width", d => xScale.bandwidth())
                .attr('fill', function(d){ return(color_bar(d.Days)) })



         var data_2005={}
         pie_data.map(d => {
             data_2005[d["Days"]] = d["Vehicles_2005"];
             return data_2005;   
         });
         update_piechart(data_2005)
              

   
    }


    if(selectedOption==2006){
        //update Geometry Chart
         update(selectedOption,"Accidents_2006.csv")



 // Barchart onclick listner for 2006 year
 var maxSum=d3.max(data, function(d) { return d.Casualities_2006; } );
 yScale.domain([
               0,maxSum
           ])
            
 var yAxis = d3.axisLeft(yScale);
 
 changing_axis.transition().duration(1000).call(yAxis);
 
 bars.on('mouseover', function(d) {
        d3.selectAll("rect")
            .transition()
            .duration('50')
            .attr('opacity', '.5');

        d3.select(this)
            .transition()
            .duration('50')
            .attr('opacity', '1');
        
            tooltipbar.html(`Number of Casualities: `+ d.Casualities_2006)
            .style('visibility', 'visible');
    })
        .on('mousemove', function () {
            tooltipbar.style('top', d3.event.pageY + 10 + 'px')
                    .style('left', d3.event.pageX + 10 + 'px');
        })
        .on('mouseout', function(d) {
        d3.selectAll("rect")
            .transition()
            .duration('50')
            .attr('opacity', '1')
        
            tooltipbar.html(``).style('visibility', 'hidden');
        })
        .transition() 
            .attr("x", function(d) { return xScale(d.Days); })
            .attr("y", function(d) { return yScale(d.Casualities_2006); })
            .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.Casualities_2006); })
            .attr("width", d => xScale.bandwidth())
            .attr('fill', function(d){ return(color_bar(d.Days)) })
            
     



     //Piechart onClick Listner for 2006 year


    var data_2006={}
    pie_data.map(d => {
        data_2006[d["Days"]] = d["Vehicles_2006"];
        return data_2006;   
    });
    console.log(data_2006)
    update_piechart(data_2006)
         
}




    if(selectedOption==2007){

        //update Geometry Chart
    update(selectedOption,"Accidents_2007.csv")


     //Barchart onclick listner for 2007 year

     var maxSum=d3.max(data, function(d) { return d.Casualities_2007; } );
     yScale.domain([
                   0,maxSum
               ])
                
     var yAxis = d3.axisLeft(yScale);
     
     changing_axis.transition().duration(1000).call(yAxis);
     
     bars.on('mouseover', function(d) {
            d3.selectAll("rect")
                .transition()
                .duration('50')
                .attr('opacity', '.5');

            d3.select(this)
                .transition()
                .duration('50')
                .attr('opacity', '1');
            
                tooltipbar.html(`Number of Casualities: `+ d.Casualities_2007)
                .style('visibility', 'visible');
        })
            .on('mousemove', function () {
                tooltipbar.style('top', d3.event.pageY + 10 + 'px')
                        .style('left', d3.event.pageX + 10 + 'px');
            })
            .on('mouseout', function(d) {
            d3.selectAll("rect")
                .transition()
                .duration('50')
                .attr('opacity', '1')
            
                tooltipbar.html(``).style('visibility', 'hidden');
            })
            .transition() 
                .attr("x", function(d) { return xScale(d.Days); })
                .attr("y", function(d) { return yScale(d.Casualities_2007); })
                .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.Casualities_2007); })
                .attr("width", d => xScale.bandwidth())
                .attr('fill', function(d){ return(color_bar(d.Days)) })



         var data_2007={}
         pie_data.map(d => {
             data_2007[d["Days"]] = d["Vehicles_2007"];
             return data_2007;   
         });
         update_piechart(data_2007)
         
    }
    })

      
    




//BarChart

var dimensions={
    width:500,
    height:500,
    margin:{
      top: 10,
      bottom: 50,
      right: 10,
      left: 50
  }
}
var nameSelected = "Casualities_2005";
var svg1 = d3.select("#barchart")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);


var keys = d3.map(data, function(d){return(d.Day_week)}).keys()


var bar_data =  data.filter(function(d){ return d.Days != "" })
var xScale = d3.scaleBand()
.domain(
    bar_data.map(function (d) {
      return d.Days;
    })
  )
              .range([dimensions.margin.left,dimensions.width-dimensions.margin.right])
              .padding([0.2])


var maxSum=d3.max(data, function(d) { return d[nameSelected]; } );

var yScale = d3.scaleLinear()
.domain([
    0,maxSum
])
              .range([dimensions.height-dimensions.margin.bottom,dimensions.margin.top]);

var color_bar = d3.scaleOrdinal()
              .domain(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"])
              .range(d3.schemeDark2);

  var text = svg1
            .append("text")
            .attr("id", "topbartext")
            .attr("x", 320)
            .attr("y", 20)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("font-family", "sans-serif")
           
  var tooltipbar = d3
                    .select('body')
                    .append('div')
                    .attr('class', 'd3-tooltip')
                    .style('position', 'absolute')
                    .style('z-index', '10')
                    .style('visibility', 'hidden')
                    .style('padding', '10px')
                    .style('background', 'rgba(0,0,0,0.6)')
                    .style('border-radius', '4px')
                    .style('color', '#fff')
                    .text('a simple tooltip');

  var bars=svg1.append("g")
              .selectAll("g")
              .data(data)
              .enter()
              .append("rect")
              .attr("x", function(d) { return xScale(d.Days); })
              .attr("y", function(d) { return yScale(d[nameSelected]); })
              .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d[nameSelected]) })
              .attr("width", d => xScale.bandwidth())
              .attr('fill', function(d){ return(color_bar(d.Days)) })
              .on('mouseover', function(d) {
                d3.selectAll("rect")
                    .transition()
                    .duration('50')
                    .attr('opacity', '.5');

                d3.select(this)
                    .transition()
                    .duration('50')
                    .attr('opacity', '1');
                
                    tooltipbar.html(`Number of Casualities: `+ d[nameSelected])
                       .style('visibility', 'visible');
            })
            .on('mousemove', function () {
                tooltipbar.style('top', d3.event.pageY + 10 + 'px')
                          .style('left', d3.event.pageX + 10 + 'px');
            })
            .on('mouseout', function(d) {
              d3.selectAll("rect")
                .transition()
                .duration('50')
                .attr('opacity', '1')
              
                tooltipbar.html(``).style('visibility', 'hidden');
            })
    console.log(bars)



  var xAxisGen = d3.axisBottom().scale(xScale)
  var xAxis = svg1.append("g")
                  .call(xAxisGen)
                  .style("transform", `translateY(${dimensions.height-dimensions.margin.bottom}px)`)
                  

  
  var yAxis =  d3.axisLeft(yScale);

  var changing_axis = svg1.append("g")
                  .style("transform", `translateX(${dimensions.margin.left}px)`)
                  .call(yAxis)



                  svg1.append("text")
                  .attr("class", "x label")
                  .attr("text-anchor", "end")
                  .attr("x", dimensions.width-200)
                  .attr("y", dimensions.height - 6)
                  .text("Days of the Week");
// Y axis label:
svg1.append("text")
.attr("class", "y label")
.attr("text-anchor", "end")
.attr("x", -100)
.attr("y", -2)
.attr("dy", ".75em")
.attr("transform", "rotate(-90)")
.text("Number of Casualities per Day");



//Piechart




// set the dimensions and margins of the graph
var width_pie = 450
    height_pie = 450
    margin_pie = 40
    

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width_pie, height_pie) / 2 - margin_pie

// append the svg object to the div called 'my_dataviz'
var svg3 = d3.select("#Line")
     .append("svg")
    .attr("width", width_pie)
    .attr("height", height_pie)
  .append("g")
    .attr("transform", "translate(" + width_pie / 2 + "," + height_pie / 2 + ")");

// create 2 data_set


var data11={}
pie_data.map(d => {
    data11[d["Days"]] = d["Vehicles_2005"];
    return data11;   
});

// set the color scale
var color_pie = d3.scaleOrdinal()
  .domain(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"])
  .range(d3.schemeDark2);

// A function that create / update the plot for a given variable:
function update_piechart(data) {

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) {  return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  var data_ready = pie(d3.entries(data))
  console.log(data_ready)

  // map to data
  var u = svg3.selectAll('path')
    .data(data_ready)
    .enter()
    .append('path')
    .on('mouseover', function(d) {
        d3.selectAll("path")
            .transition()
            .duration('50')
            .attr('opacity', '.5');

        d3.select(this)
            .transition()
            .duration('50')
            .attr('opacity', '1');
        
            tooltipbar.html(`Number of vehicle Involved: `+ d.data.value)
               .style('visibility', 'visible');

    })
    .on('mousemove', function () {
        tooltipbar.style('top', d3.event.pageY + 10 + 'px')
                  .style('left', d3.event.pageX + 10 + 'px');
    })
    .on('mouseout', function(d) {
      d3.selectAll("path")
        .transition()
        .duration('50')
        .attr('opacity', '1')
      
        tooltipbar.html(``).style('visibility', 'hidden');
    })
    .transition()
    .duration(1000)
    .attr('d', d3.arc() 
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color_pie(d.data.key)) })
   
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

   
   
    
    
   
    
   

 

}

// Initialize the plot with the first dataset
update_piechart(data11)

          
    })  // uk.json ends

}); // accidents_2005_to_2007.csv ends




 
