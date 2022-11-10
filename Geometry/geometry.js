var width = 960,
    height = 1160;

var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

d3.json("uk.json", function(error, uk) {
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

        d3.csv("../Dataset/accidents_2005_to_2007.csv", function(error, data) {

            var keys = d3.map(data, function(d){return(d.Accident_Severity)}).keys()
            console.log(keys)
            var colorScale = d3.scale.ordinal()
                           .domain(keys)
                           .range(["#00FFFF","	#7FFFD4","#454B1B"])
            
            svg.selectAll("circle")
               .data(data)
               .enter()
               .append("circle")
               .attr("cx", function(d) {
                       return projection([d.Longitude, d.Latitude])[0];
               })
               .attr("cy", function(d) {
                       return projection([d.Longitude, d.Latitude])[1];
               })
               .attr("r", 5)
               
               .attr("fill", function(d){return colorScale(d.Accident_Severity)})

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