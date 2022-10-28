
d3.csv("../Dataset/accidents_2005_to_2007.csv").then(
  function(dataset){
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
    var svg=d3.select("#linegraph").
               style("width",dimensions.width).
               style("height",dimensions.height)
    
    
    


})