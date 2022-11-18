

d3.json("uk.json", function(error, uk) {
    var width = 960,
    height = 1160;

var svg = d3.select("#geometry")
            .attr("width", width)
            .attr("height", height);
    if (error) return console.error(error);

    var subunits = topojson.feature(uk, uk.objects.subunits);

    var projection = d3.geo.albers()
                        .center([0, 55.4])
                        .rotate([4.4, 0])
                        .parallels([50, 60])
                        .scale(6000)
                        .translate([width / 2, height / 2]);
                        
    var path = d3.geo.path()
                    .projection(projection);

    svg.append("path")
        .datum(subunits)
        .attr("d", path);
    
    d3.csv("accidents_2005_to_2007.csv", function(error, data) {
      years = d3.extent(data, d => d.Year)
      dataInitial = data.filter(d => d.Year === years[0])
        var keys = d3.map(dataInitial, function(d){return(d.Accident_Severity)}).keys()
        console.log(dataInitial)
    //     var years=d3.map(data, function(d){return(d.Year)}).keys()
    //     console.log(data)

    //     d3.select("#accident")
    //   .selectAll('myOptions')
    //  	.data(years)
    //   .enter()
    // 	.append('option')
    //   .text(function (d) { return d; }) // text showed in the menu
    //   .attr("value", function (d) { return d; }) // corresponding value returned by the button

    //     console.log(years)
       
        var colorScale = d3.scale.ordinal()
                        .domain(keys)
                        .range(["	#9FE2BFF","	#009E60","#00FF7F"])
        


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
        
        
    
        d3.select("#accident").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
           
            if(selectedOption==2006){
                // update(selectedOption,"Accidents_2006.csv")
                
                    dataInitial = data.filter(d => d.Year === years[1])
                    console.log(dataInitial)
                    var keys = d3.map(data, function(d){return(d.Accident_Severity)}).keys()
                    
                    
                    var colorScale = d3.scale.ordinal()
                                    .domain(keys)
                                    .range(["	#9FE2BFF","	#009E60","#00FF7F"])
                    
            
            
                    geometry.transition()
                        .data(dataInitial)
                        
                        
                        .attr("cx", function(d) {
                                return projection([d.Longitude, d.Latitude])[0];
                        })
                        .attr("cy", function(d) {
                                return projection([d.Longitude, d.Latitude])[1];
                        })
                        .attr("r", 2)
                        
                        .attr("fill", function(d){return colorScale(d.Accident_Severity)})
                      

            }
            if(selectedOption=="2007"){
              
              dataInitial = data.filter(d => d.Year === years[2])
              console.log(dataInitial)
              var keys = d3.map(data, function(d){return(d.Accident_Severity)}).keys()
              
              
              var colorScale = d3.scale.ordinal()
                              .domain(keys)
                              .range(["	#9FE2BFF","	#009E60","#00FF7F"])
              
      
      
              geometry.transition()
                  .data(dataInitial)
                  
                  
                  .attr("cx", function(d) {
                          return projection([d.Longitude, d.Latitude])[0];
                  })
                  .attr("cy", function(d) {
                          return projection([d.Longitude, d.Latitude])[1];
                  })
                  .attr("r", 2)
                  
                  .attr("fill", function(d){return colorScale(d.Accident_Severity)})
                

            }
            if(selectedOption=="2005"){
                console.log(selectedOption)
                update(selectedOption,"Accidents_2005.csv")
            }
        })
      });

        

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



});







// Scatterplot 

d3.csv("accidents_2005_to_2007.csv", function(error, data) {
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

    var svg = d3.select("#barchart")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height);

    years = d3.extent(data, d => d.Year)

    dataInitial = data.filter(d => d.Year === years[0])

    console.log(dataInitial)

    var databyweek = d3.nest()
                    .key(function(d) { return d.Day_of_Week;})
                    .rollup(function(d) { 
                    return d3.sum(d, function(g) {return g.Number_of_Casualties; });
                    })
                    .sortKeys(d3.ascending)
                    .entries(dataInitial);
    console.log(databyweek)


    var keys = d3.map(dataInitial, function(d){return(d.Day_of_Week)}).keys()

    console.log(keys)

    var xScale = d3.scaleBand()
                  .domain(keys)
                  .range([dimensions.margin.left,dimensions.width-dimensions.margin.right])
                  .padding([0.2])

   

    var maxSum = d3.max(databyweek, function(d){
        return +d.value; //<-- convert to number
      })
    console.log(maxSum)

    var yScale = d3.scaleLinear()
                  .domain([0,maxSum])
                  .range([dimensions.height-dimensions.margin.bottom,dimensions.margin.top]);

  

      var text = svg
                .append("text")
                .attr("id", "topbartext")
                .attr("x", 320)
                .attr("y", 20)
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("font-family", "sans-serif")
                .text("Number of Casuality based on day of week");

      // var bars = bounds
      //           .selectAll("bar")
      //           .data(databyweek)
      //           .enter()
      //           .append("rect")
      //           .attr("x", function(d) { return xScale(d.key); })
      //           .attr("width", xScale.bandwidth)
      //           .attr("y", function(d) { return yScale(d.value); })
      //           .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.value); })
      //           .attr("fill", "steelblue")

      var bars=svg.append("g")
                  .selectAll("g")
                  .data(databyweek)
                  
                  .enter()
                  .append("rect")
                  .attr("x", function(d) { return xScale(d.key); })
                  .attr("y", function(d) { return yScale(d.value); })
                  .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.value); })
                  .attr("width", d => xScale.bandwidth())
                  .attr("fill", "steelblue")



      var xAxisGen = d3.axisBottom().scale(xScale)
      var xAxis = svg.append("g")
                      .call(xAxisGen)
                      .style("transform", `translateY(${dimensions.height-dimensions.margin.bottom}px)`)

      
      var yAxis = d3.axisLeft().scale(yScale)

      var changing_axis = svg.append("g")
                      .style("transform", `translateX(${dimensions.margin.left}px)`)
                      .call(yAxis)
     
  
    
  
   


      d3.select("#accident").on("change", function () {
          nameSelected = "2007";
          dataInitial = data.filter(d => d.Year === years[2])
          console.log(dataInitial)
  
      var databyweek = d3.nest()
                        .key(function(d) { return d.Day_of_Week;})
                        .rollup(function(d) { 
                          return d3.sum(d, function(g) {return g.Number_of_Casualties; });
                        })
                        .entries(dataInitial);
      console.log(databyweek)
      var maxSum = d3.max(databyweek, function(d){
              return +d.value; //<-- convert to number
      })
      var yScale = d3
                  .scaleLinear()
                  .domain([
                    0,maxSum
                    ])
                  .range([dimensions.height, 0]);
      
      var yAxis = d3.axisLeft().scale(yScale)
      
      changing_axis.transition().call(yAxis);
      
      bars.transition()
         
          .data(databyweek)
          
          
          .attr("x", function(d) { return xScale(d.key); })
          .attr("y", function(d) { return yScale(d.value); })
          .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.value); })
          .attr("width", d => xScale.bandwidth())
          .attr("fill", "steelblue")
                  })

      d3.select("#accident").on("change", function () {
          nameSelected = "2006";
          dataInitial = data.filter(d => d.Year === years[1])
          console.log(dataInitial)

      
          var databyweek = d3.nest()
                          .key(function(d) { return d.Day_of_Week;})
                          .rollup(function(d) { 
                            return d3.sum(d, function(g) {return g.Number_of_Casualties; });
                          })
                          .entries(dataInitial);
          console.log(databyweek)
          var maxSum = d3.max(databyweek, function(d){
          return +d.value; //<-- convert to number
          })
          var yScale = d3
              .scaleLinear()
              .domain([
                0,maxSum
                ])
              .range([dimensions.height, 0]);

          var yAxis = d3.axisLeft().scale(yScale)

          changing_axis.transition().call(yAxis);

          bars.transition()
          
          .data(databyweek)


          .attr("x", function(d) { return xScale(d.key); })
          .attr("y", function(d) { return yScale(d.value); })
          .attr("height", function(d) { return dimensions.height-dimensions.margin.bottom - yScale(d.value); })
          .attr("width", d => xScale.bandwidth())
          .attr("fill", "steelblue")

      });
    })

//     x = d3.scaleLinear()
//   .domain([0, d3.max(dataInitial, d => d.Day_of_Week)])
//   .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
//   .nice()
//   y = d3.scaleLinear()
//   .domain([0, d3.max(dataInitial, d => d.Number_of_Casualties)])
//   .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
//   .nice()
//   color = d3.scaleOrdinal()
//   .domain(dataInitial.map(d => d.Accident_Severity))
//   .range(["	#9FE2BFF","	#009E60","#00FF7F"])


//   {
   
  
//     svg.append('g')
//       .attr('transform', `translate(0, ${dimensions.height - dimensions.margin.bottom})`)
//       .call(d3.axisBottom(x))
//       // Add x-axis title 'text' element.
//       .append('text')
//         .attr('text-anchor', 'end')
//         .attr('fill', 'black')
//         .attr('font-size', '12px')
//         .attr('font-weight', 'bold')
//         .attr('x', dimensions.width - dimensions.margin.right)
//         .attr('y', -10)
//         .text('Fertility');
  
//     svg.append('g')
//       .attr('transform', `translate(${dimensions.margin.left}, 0)`)
//       .call(d3.axisLeft(y))
//       // Add y-axis title 'text' element.
//       .append('text')
//         .attr('transform', `translate(20, ${dimensions.margin.top}) rotate(-90)`)
//         .attr('text-anchor', 'end')
//         .attr('fill', 'black')
//         .attr('font-size', '12px')
//         .attr('font-weight', 'bold')
//         .text('Life Expectancy');
    
//     // Add a background label for the current year.
//     const yearLabel = svg.append('text')
//       .attr('class', 'year')
//       .attr('x', 40)
//       .attr('y', dimensions.height - dimensions.margin.bottom - 20)
//       .attr('fill', '#ccc')
//       .attr('font-family', 'Helvetica Neue, Arial')
//       .attr('font-weight', 500)
//       .attr('font-size', 80)
//       .text(years[0]);
  


//       const countries=svg.selectAll("circle")
//       .data(dataInitial)
//       .enter()
//       .append("circle")
//       .attr('opacity', 0.75)
//       .attr('cx', d => x(d.Day_of_Week))  
//       .attr('cy', d => y(d.Number_of_Casualties))
//       .attr("r", 2)
      
//       .attr("fill", function(d){return color(d.Accident_Severity)})
  

    // const countries = svg
    //   .selectAll('circle')
    //   .data(dataInitial)
     
    
    //     .attr('class', 'accidents')
    //     .attr('opacity', 0.75)
    //     .attr('fill', d => color(d.Accident_Severity))
    //     .attr('cx', d => x(d.Number_of_Vehicles))  
    //     .attr('cy', d => y(d.Number_of_Casualties))
    
    // // add a tooltip
    // countries
    //   .append('title')
    //   .text(d => d.country);
    
    // Add mouse hover interactions, using D3 to update attributes directly.
    // In a stand-alone context, we could also use stylesheets with 'circle:hover'.
    // countries
    //    // The 'on()' method registers an event listener function
    //   .on('mouseover', function() {
    //     // The 'this' variable refers to the underlying SVG element.
    //     // We can select it directly, then use D3 attribute setters.
    //     // (Note that 'this' is set when using "function() {}" definitions,
    //     //  but *not* when using arrow function "() => {}" definitions.)
    //     d3.select(this).attr('stroke', '#333').attr('stroke-width', 2);
    //   })
    //   .on('mouseout', function() {
    //     // Setting the stroke color to null removes it entirely.
    //     d3.select(this).attr('stroke', null);
    //   });
  
//     return svg.node();
 
