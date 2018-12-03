var margin = {top:50, right:0, bottom:100, left:100};
var width=960-margin.left-margin.right;
var height=630-margin.top-margin.bottom;
var gridSize=Math.floor(width/24);
var legendElementWidth=gridSize*2.665;
var buckets = 10;
var colors = ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"];
var days = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
var times = ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];
var heatmap;
var legend;

var newFontSize = width * 62.5 / 900;
d3.select("html").style("font-size", newFontSize + "%");

var svgHM = d3.select("#heatmap").append("svg")
	.attr("width",width + margin.left+margin.right)
	.attr("height", height+margin.top+margin.bottom)
	.append("g")
	.attr("transform", "translate("+ margin.left+","+margin.top+")");

function setUpHeatMap(data) {
  dataset = data;
	var colorScale = d3.scaleQuantile()
		.domain([0, (d3.max(dataset, function(d){return d.checkouts;})/2),
			d3.max(dataset, function(d){return d.checkouts;})])
		.range(colors);


	var dayLabels = svgHM.selectAll(".dayLabel")
		.data(days)
		.enter().append("text")
		.text(function (d) {return d; })
		.attr("y", function (d, i){ return i*gridSize;})
		.style("text-anchor", "end")
		.attr("transform", "translate(-6," + gridSize/1.5+")")
            .style("fill", "white")
		.attr("class", function(d, i) { return ((i>=0 && i<=4) ?
			"dayLabel mono axis axis-workweek": "dayLabel mono axis"); });

	var timeLabels = svgHM.selectAll(".timeLabel")
		.data(times)
		.enter().append("text")
		.text(function(d){return d;})
		.attr("x", function(d,i) {return i * gridSize;})
		.attr("y",0)
		.style("text-anchor", "middle")
            .style("fill", "white")
		.attr("transform", "translate(" + gridSize/2+", -6)")
		.attr("class", function(d, i) { return ((i>=9 && i<= 17) ?
			"timeLabel mono axis axis-worktime": "timeLabel mono axis"); });

	var heatMap = svgHM.selectAll(".hour")
		.data(dataset)
		.enter().append("rect")
		.attr("x", function(d) {return (d.checkoutyear-2005) * gridSize;})
		.attr("y", function(d) {return (d.checkoutmonth-1) * gridSize;})
		.attr("rx", 0)
		.attr("ry", 0)
		.attr("class", "hour bordered")
		.attr("width", gridSize)
		.attr("height", gridSize)
		.style("fill", colors[0])
             .style("stroke", "white")
            .style("stroke-opacity", 0.6);

	heatMap.transition().duration(1000)
		.style("fill", function(d){ return colorScale(d.checkouts);});

	heatMap.append("title").text(function(d) {return d.checkouts;});

	var legend = svgHM.selectAll(".legend")
		.data([0].concat(colorScale.quantiles()), function(d) {return d;})
		.enter().append("g")
		.attr("class", "legend");

	legend.append("rect")
		.attr("x", function(d, i){ return legendElementWidth * i;})
		.attr("y", height)
		.attr("width", legendElementWidth)
		.attr("height", gridSize/2)
		.style("fill", function(d, i) {return colors[i]; });

	legend.append("text")
		.attr("class", "mono")
		.text(function(d) {return "≥ "+d.toString().substr(0,4);})
		.attr("x", function(d, i){ return legendElementWidth *i;})
		.attr("y", height+ gridSize)
            .style("fill", "white");

}


function updateHeatmap(newTitle){

  // d3.selectAll(".hour").remove();
  // d3.selectAll(".legend").remove();

	svg.selectAll(".legend").attr("opacity", 0);


  console.log("Hi, I've entered updateHeatmap", dataset);

	colorScale = d3.scaleQuantile()
		.domain([0, (d3.max(dataset, function(d){return d.checkouts;})/2), d3.max(dataset, function(d){return d.checkouts;})])
		.range(colors);


	var heatMap = svgHM.selectAll(".hour")
			.data(dataset)
			.enter().append("rect")
			.attr("x", function(d) {return (d.checkoutyear-2005) * gridSize;})
			.attr("y", function(d) {return (d.checkoutmonth-1) * gridSize;})
			.attr("rx", 0)
			.attr("ry", 0)
			.attr("class", "hour")
			.attr("width", gridSize)
			.attr("height", gridSize)
			.style("fill", colors[0])
              .style("stroke", "white")
              .style("stroke-opacity", 0.6);

	heatMap.selectAll("title").text(function(d) {return d.checkouts;});

	var legend = svgHM.selectAll(".legend")
			.data([0].concat(colorScale.quantiles()), function(d) {return d;})
			.enter().append("g")
			.attr("class", "legend");

	legend.append("rect")
		.attr("x", function(d, i){ return legendElementWidth * i;})
		.attr("y", height)
		.attr("width", legendElementWidth)
		.attr("height", gridSize/2)
		.style("fill", function(d, i) {return colors[i]; });

	legend.append("text")
		.attr("class", "mono")
		.text(function(d) {return "≥ "+d.toString().substr(0,4);})
		.attr("x", function(d, i){ return legendElementWidth *i;})
		.attr("y", height+ gridSize)
            .style("fill", "white");

}
