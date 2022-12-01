d3.csv("accidents_2005_to_2007.csv", function(error, data) {

d3.json("uk.json", function(error, uk) {
    var width = 960,
    height = 1050;

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
                        
    var path = d3.geo.path()
                    .projection(projection);

    svg.append("path")
        .datum(subunits)
        .attr("d", path);
    
   
        // years = d3.extent(data, d => d.Year)
        // dataInitial = data.filter(d => d.Year === years[0])
        dataInitial = data.filter(function(d) {
            
            return d.Year < 2006;
          })
        console.log(dataInitial)
   
        var keys = d3.map(dataInitial, function(d){return(d.Accident_Severity)}).keys()
        
  
       
        var colorScale = d3.scale.ordinal()
                        .domain(keys)
                        .range(["#9FE2BFF","#009E60","#00FF7F"])
        


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

           

    function update(selectedOption,Accident_year){
        d3.csv(Accident_year, function(error, data) {
          
                var keys = d3.map(data, function(d){return(d.Accident_Severity)}).keys()
                
         
               
                var colorScale = d3.scale.ordinal()
                                .domain(keys)
                                .range(["	#9FE2BFF","	#009E60","#00FF7F"])
                
        
        
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
    
       
                
        //             dataInitial = data.filter(d => d.Year === years[1])
        //             console.log(dataInitial)
        //             var keys = d3.map(data, function(d){return(d.Accident_Severity)}).keys()
                    
                    
        //             var colorScale = d3.scale.ordinal()
        //                             .domain(keys)
        //                             .range(["	#9FE2BFF","	#009E60","#00FF7F"])
                    
            
            
        //             geometry.selectAll("circle")
        //                 .data(dataInitial)
        //                 .transition()
                        
        //                 .attr("cx", function(d) {
        //                         return projection([d.Longitude, d.Latitude])[0];
        //                 })
        //                 .attr("cy", function(d) {
        //                         return projection([d.Longitude, d.Latitude])[1];
        //                 })
        //                 .attr("r", 2)
                        
        //                 .attr("fill", function(d){return colorScale(d.Accident_Severity)})
                      

        //     }
        //     if(selectedOption=="2007"){
              
        //       dataInitial = data.filter(d => d.Year === years[2])
        //       console.log(dataInitial)
        //       var keys = d3.map(data, function(d){return(d.Accident_Severity)}).keys()
              
              
        //       var colorScale = d3.scale.ordinal()
        //                       .domain(keys)
        //                       .range(["	#9FE2BFF","	#009E60","#00FF7F"])
              
      
      
        //       geometry.transition()
        //           .data(dataInitial)
                  
                  
        //           .attr("cx", function(d) {
        //                   return projection([d.Longitude, d.Latitude])[0];
        //           })
        //           .attr("cy", function(d) {
        //                   return projection([d.Longitude, d.Latitude])[1];
        //           })
        //           .attr("r", 2)
                  
        //           .attr("fill", function(d){return colorScale(d.Accident_Severity)})
                

        //     }
        //     if(selectedOption=="2005"){
        //         console.log(selectedOption)
        //         update(selectedOption,"Accidents_2005.csv")
        //     }
        // })
    

        

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





// On click Listener

    d3.select("#accident").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
       
        if(selectedOption==2006){
             update(selectedOption,"Accidents_2006.csv")
       console.log(selectedOption)


     // Barchart onclick listner for 2006 year
     var maxSum=d3.max(data, function(d) { return d.Casualities_2006; } );
     yScale.domain([
                   0,maxSum
               ])
                
     var yAxis = d3.axisLeft(yScale);
     
     changing_axis.transition().duration(1000).call(yAxis);
     
     bars.transition() 
         .attr("x", function(d) { return xScale(d.Days); })
         .attr("y", function(d) { return yScale(d.Casualities_2006); })
         .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.Casualities_2006); })
         .attr("width", d => xScale.bandwidth())
         .attr("fill", "steelblue")
             
    }
    if(selectedOption==2005){
    update(selectedOption,"Accidents_2005.csv")
    console.log(selectedOption)

    //Barchart onClick Listner for 2005 Year


     // Barchart onclick listner for 2006 year
     var maxSum=d3.max(data, function(d) { return d.Casualities_2005; } );
     yScale.domain([
                   0,maxSum
               ])
                
     var yAxis = d3.axisLeft(yScale);
     
     changing_axis.transition().duration(1000).call(yAxis);
     
     bars.transition() 
         .attr("x", function(d) { return xScale(d.Days); })
         .attr("y", function(d) { return yScale(d.Casualities_2005); })
         .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.Casualities_2005); })
         .attr("width", d => xScale.bandwidth())
         .attr("fill", "steelblue")

   
    }
    if(selectedOption==2007){
    update(selectedOption,"Accidents_2007.csv")


     //Barchart onclick listner for 2007 year

     var maxSum=d3.max(data, function(d) { return d.Casualities_2007; } );
     yScale.domain([
                   0,maxSum
               ])
                
     var yAxis = d3.axisLeft(yScale);
     
     changing_axis.transition().duration(1000).call(yAxis);
     
     bars.transition() 
         .attr("x", function(d) { return xScale(d.Days); })
         .attr("y", function(d) { return yScale(d.Casualities_2007); })
         .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.Casualities_2007); })
         .attr("width", d => xScale.bandwidth())
         .attr("fill", "steelblue")
    }
    })

      
    




//BarChart

var dimensions={
    width:800,
    height:800,
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


//var keys = d3.map(data, function(d){return(d.Day_week)}).keys()



var xScale = d3.scaleBand()
.domain(
    data.map(function (d) {
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



  var text = svg1
            .append("text")
            .attr("id", "topbartext")
            .attr("x", 320)
            .attr("y", 20)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("font-family", "sans-serif")
            .text("Number of Casuality based on day of week");


  var bars=svg1.append("g")
              .selectAll("g")
              .data(data)
              
              .enter()
              .append("rect")
              .attr("x", function(d) { return xScale(d.Days); })
              .attr("y", function(d) { return yScale(d[nameSelected]); })
              .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d[nameSelected]) })
              .attr("width", d => xScale.bandwidth())
              .attr("fill", "steelblue")
              .on("mouseover", function (d, i) {
                d3.select(this).attr("stroke-width", 2).attr("stroke", "red");
                text.transition().text("Count per day: " + i[nameSelected]);
              })
              .on("mouseout", function (d) {
                d3.select(this).attr("stroke-width", "0");
              });



  var xAxisGen = d3.axisBottom().scale(xScale)
  var xAxis = svg1.append("g")
                  .call(xAxisGen)
                  .style("transform", `translateY(${dimensions.height-dimensions.margin.bottom}px)`)
                  

  
  var yAxis =  d3.axisLeft(yScale);

  var changing_axis = svg1.append("g")
                  .style("transform", `translateX(${dimensions.margin.left}px)`)
                  .call(yAxis)


    })  // uk.json ends

}); // accidents_2005_to_2007.csv ends












// //Linechart


// var dimensions={
//     width:800,
//     height:800,
//     margin:{
//       top: 10,
//       bottom: 50,
//       right: 10,
//       left: 50
//   }
// }



// var parseDate = d3.time.format("%d-%b-%y").parse;

// var svg = d3.select("#Line")
//         .attr("width", dimensions.width)
//         .attr("height", dimensions.height);
// var xScale = d3.scaleTime().range([dimensions.margin.left,dimensions.width-dimensions.margin.right]);
// var yScale = d3.scaleLinear().range([dimensions.height-dimensions.margin.bottom,dimensions.margin.top]);

// var xAxisGen = d3.axisBottom().scale(xScale)
// var xAxis = svg.append("g")
//     .call(xAxisGen)
//     .style("transform", `translateY(${dimensions.height-dimensions.margin.bottom}px)`)

// var yAxisGen = d3.axisLeft().scale(yScale)
// var yAxis = svg.append("g")
//     .call(yAxisGen)
//     .style("transform", `translateX(${dimensions.margin.left}px)`)

// var valueline = d3.line()
//                 .x(function(d) { return xScale(d.Date); })
//                 .y(function(d) { return yScale(d.Number_of_Casualties); });

     
// d3.csv("Accidents_2005.csv", function(error, data) {
//     data.forEach(function(d) {
//         d.Date = parseDate(d.Date);
//         d.Number_of_Casualties = +d.Number_of_Casualties;
//     });
//     xScale.domain(data.map(function (d) {
//         return d.Date;
//       }));
//     yScale.domain([0, d3.max(data, function(d) { return d.Number_of_Casualties; })]);

//     svg.append("path")
//       .data(data)
//       .attr("fill","red")
//       .attr("stroke", "red")
//       .attr("stroke-width", 15)
//       .attr("d", valueline(data))
       

  




// })

// d3.csv("accidents_2005_to_2007.csv",function(data) {

    
  
  
             
//   var databyyear = d3.nest()
//             .key(function(d) { return d.Year;})
//             .rollup(function(d) { 
//                   return d3.sum(d, function(g) {return g.Number_of_Casualties; });
//                   })
//             .sortKeys(d3.ascending)
//             .entries(data);
//       console.log(databyyear)
  
  
//   var keys = d3.map(data, function(d){return(d.Year)}).keys()
  
//   var xScale = d3.scaleBand()
//      .domain(keys)
//      .range([dimensions.margin.left,dimensions.width-dimensions.margin.right])
    
//   var maxSum = d3.max(databyyear, function(d){
//                return +d.value;
//                })
//     console.log(maxSum)
    
    
//   var yScale = d3.scaleLinear()
//       .domain([0,maxSum])
//       .range([dimensions.height-dimensions.margin.bottom,dimensions.margin.top]);
    
  
//   svg.append("path")
//       .datum(databyyear)
//       .attr("fill","red")
//       .attr("stroke", "red")
//       .attr("stroke-width", 15)
//       .attr("d", d3.line()
//         .x(function(d) { return xScale(d.key) })
//         .y(function(d) { return yScale(d.value) })
//         )
//         .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.value); })
//         .attr("width", d => xScale.bandwidth())
//   })
 
