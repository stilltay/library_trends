 var dataset;
var days = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
	times = ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];
  
  var margin = {top:40, right:50, bottom:70, left:50};
  
  // calculate width and height based on window size
  var w = Math.max(Math.min(window.innerWidth, 1000), 500) - margin.left - margin.right - 20,
  gridSize = Math.floor(w / times.length),
	h = gridSize * (days.length+2);

  //reset the overall font size
	var newFontSize = w * 62.5 / 900;
	d3.select("html").style("font-size", newFontSize + "%");
  
  // svg container
  var svg = d3.select("#heatmap")
  	.append("svg")
  	.attr("width", w + margin.top + margin.bottom)
  	.attr("height", h + margin.left + margin.right)
  	.append("g")
  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // linear colour scale
/*
  var colours = d3.scaleLinear()
  	.domain(0,1000)
  	.range(["#87cefa", "#86c6ef", "#85bde4", "#83b7d9", "#82afce", "#80a6c2", "#7e9fb8", "#7995aa", "#758b9e", "#708090"]);*/
  
  var dayLabels = svg.selectAll(".dayLabel")
  	.data(days)
  	.enter()
  	.append("text")
  	.text(function(d) { return d; })
  	.attr("x", 0)
  	.attr("y", function(d, i) { return (i * gridSize * 1.11) + 2; })
  	.style("text-anchor", "end")
		.attr("transform", "translate(-6," + gridSize / 2 + ")")

  var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter()
    .append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)");

    
    
    $.ajax({
    url: "https://data.seattle.gov/resource/tjb6-zsmc.json?$select=checkoutmonth,checkoutyear,checkouts,title&$where=(title='Harry Potter and the deathly hallows / by J.K. Rowling ; illustrations by Mary GrandPré.')",
    type: "GET",
    data: {
      "$limit" : 10000,
      "$$app_token" : "gj5klMMMFIV45YA3S1Qkk8Ssd"
    }
    }).done(function(data) {
        alert("Retrieved " + data.length + " records from the dataset!");
        data.forEach(function(d) {
        d.checkoutmonth = +d.checkoutmonth;
        d.checkoutyear = +d.checkoutyear;
        d.checkouts = +d.checkouts;
        });
     dataset = data;
        console.log(dataset);
        
        var frequencyExtent = d3.extent(dataset, function(d){
		return parseFloat(d.checkouts);
	   });
        
        console.log(frequencyExtent);
        
        var colours = d3.scaleLinear()
  	     .domain(frequencyExtent)
  	     .range(["#87cefa", "#86c6ef", "#85bde4", "#83b7d9", "#82afce", "#80a6c2", "#7e9fb8", "#7995aa", "#758b9e", "#708090"]);
        
         var colorScale = d3.scaleSequential(d3.interpolateViridis);
    
        var max = d3.max(dataset, function(d){return +d.checkouts;});
        var min = d3.min(dataset, function(d){return +d.checkouts;});
        console.log(max);
        console.log(min);


    /*
    // group data by location
    var nest = d3.nest()
      .key(function(d) { return d.location; })
      .entries(dataset);

    // array of locations in the data
    var locations = nest.map(function(d) { return d.key; });
    var currentLocationIndex = 0;

    // create location dropdown menu
    var locationMenu = d3.select("#locationDropdown");
    locationMenu
      .append("select")
      .attr("id", "locationMenu")
      .selectAll("option")
        .data(locations)
        .enter()
        .append("option")
        .attr("value", function(d, i) { return i; })
        .text(function(d) { return d; });
    */

    // function to create the initial heatmap
    var drawHeatmap = function(dataset) {

        /*
      // filter the data to return object of location of interest
      var selectLocation = nest.find(function(d) {
        return d.key == location;
      });*/

      var heatmap = svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d) { return (d.checkoutyear-2005) * gridSize; })
        .attr("y", function(d) { return (d.checkoutmonth-1) * gridSize; })
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("stroke", "white")
        .style("stroke-opacity", 0.6)
        .style("fill", function(d) {  
            var normalizedValue = (+d.checkouts - min) / (max - min);
            return colorScale(normalizedValue); })
      }
        drawHeatmap(dataset);
        
        console.log(heatmap);

        /*
    var updateHeatmap = function(dataset) {
      console.log("currentLocationIndex: " + currentLocationIndex)
      // filter data to return object of location of interest
      var selectLocation = nest.find(function(d) {
        return d.key == location;
      });

      // update the data and redraw heatmap
      var heatmap = svg.selectAll(".checkoutmonth")
        .data(dataset)
        .transition()
          .duration(500)
          .style("fill", function(d) { return colours(d.checkouts); })
    }

    // run update function when dropdown selection changes
    locationMenu.on("change", function() {
      // find which location was selected from the dropdown
      var selectedLocation = d3.select(this)
        .select("select")
        .property("value");
      currentLocationIndex = +selectedLocation;
      // run update function with selected location
      updateHeatmap(locations[currentLocationIndex]);
    });    

    d3.selectAll(".nav").on("click", function() {
      if(d3.select(this).classed("left")) {
        if(currentLocationIndex == 0) {
          currentLocationIndex = locations.length-1;
        } else {
          currentLocationIndex--;  
        }
      } else if(d3.select(this).classed("right")) {
        if(currentLocationIndex == locations.length-1) {
          currentLocationIndex = 0;
        } else {
          currentLocationIndex++;  
        }
      }
      d3.select("#locationMenu").property("value", currentLocationIndex)
      updateHeatmap(locations[currentLocationIndex]);
    })*/
  })