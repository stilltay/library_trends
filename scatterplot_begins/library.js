var svg = d3.select('svg');
var svgWidth = +svg.attr('width') -60;
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 40, b: 140, l: 70};

var svgTB = d3.select("#toolbar").append("svg")
		.attr("width",1800)
		.attr("height",100)
		.append("g")
		.attr("transform", "translate("+ padding.l+","+ padding.t+")");

var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var materialColors = {MIXED: '#fc5a74', BOOK: '#fee633',
   REGRPRINT: '#24d5e8', VIDEODISC: '#82e92d', MAGAZINE: '#fc5a74' , EBOOK:'#0016FE', SOUNDDISC:'#FE00EE', SONG:'#00FEF5'};

var yearColors = {2005: '#2E00E3', 2006: '#2E10E3',
    2007: '#2E29E3', 2008: '#2E3FE3', 2009: '#2E56E3', 2010: '#2E6AE3', 2011: '#2E7FE3',
    2012: '#2E97E3', 2013: '#2EA5E3', 2014: '#2EB4E3', 2015: '#2EC6E3', 2016: '#2ED6E3',
    2017: '#2EE8E3', 2018: '#2EF8E3'};

//variables for onclick handler
var prevD;
var prevI = -1;
var secondClick = false;

d3.csv('./library.csv', function(error, dataset) {
  console.log(dataset);
  library = dataset;
  var parseTime = d3.timeParse("%Y");

  library.forEach(function(d) {
    d.checkoutyear = parseTime(d.checkoutyear);
    d.checkouts = +d.checkouts;
  });

  var yearsExtent = d3.extent(library, function(d) {
      return Number(d['checkoutyear']);
  });

  var frequencyExtent = d3.extent(library, function(d) {
      return Number(d['checkouts']);
  });

  xScale = d3.scaleTime()
    .domain(yearsExtent)
      .rangeRound([20, chartWidth]);

  yScale = d3.scaleLinear()
    .domain(frequencyExtent)
      .range([chartHeight-20, 0]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(70,720)')
    .attr('stroke', 'white')
    .call(xAxis);

  svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(70, 40)')
      .attr('stroke', 'white')
      .call(yAxis);

  svg.append('text')
    	.attr('class', 'x-label')
    	.attr('transform', 'translate(850, 790)')
        .style("fill", "white")
    	.text('Checkout Year');

  svg.append('text')
    	.attr('class', 'y-label')
        .attr('transform', 'translate(20, 480) rotate(-90)')
        .style("fill", "white")
    	.text('Frequency of Checkouts/Month');

    //container for all buttons
    var allButtons= svgTB.append("g")
                                .attr("id","allButtons");

    //labels for buttons
    var labels= ["Publication Year","Checkout Month","Usage Class", "Material Type"];

     var defaultColor= "#7777BB";
     var hoverColor= "#0000ff";
     var pressedColor= "#000077";

    var min;
    var max;

     //groups for each button (which will hold a rect and text)
    var buttonGroups= allButtons.selectAll("g.button")
        .data(labels)
        .enter()
        .append("g")
        .attr("class","button")
        .style("cursor","pointer")
            .on("click",function(d,i) {
                updateButtonColors(d3.select(this), d3.select(this.parentNode));
                updateLegendScale(library, i);
                updateColorScale(library, i);
            })
            .on("mouseover", function() {
                if (d3.select(this).select("rect").attr("fill") != pressedColor) {
                d3.select(this)
                    .select("rect")
                    .attr("fill",hoverColor);
                }
            })
            .on("mouseout", function() {
                if (d3.select(this).select("rect").attr("fill") != pressedColor) {
                    d3.select(this)
                        .select("rect")
                        .attr("fill",defaultColor);
                }
            })

    function updateButtonColors(button, parent) {
                parent.selectAll("rect")
                        .attr("fill",defaultColor);

                button.select("rect")
                        .attr("fill",pressedColor);
    }


    var bWidth= 100; //button width
    var bHeight= 40; //button height
    var bSpace= 20; //space between buttons
    var x0= 100; //x offset
    var y0= 10; //y offset

    buttonGroups.append("rect")
                        .attr("class","buttonRect")
                        .attr("width",bWidth)
                        .attr("height",bHeight)
                        .attr("x",function(d,i) {return x0+(bWidth+bSpace)*i;})
                        .attr("y",y0)
                        .attr("rx",5) //rx and ry give the buttons rounded corners
                        .attr("ry",5)
                        .attr("fill",defaultColor);

    buttonGroups.append("text")
                        .attr("class","buttonText")
                        .attr("x",function(d,i) {
                            return x0 + (bWidth+bSpace)*i + bWidth/2;
                        })
                        .attr("y",y0+bHeight/2)
                        .attr("text-anchor","middle")
                        .attr("dominant-baseline","central")
                        .attr("fill","white")
                        .text(function(d) {return d;});
  updateChart();

});


function updateChart() {

  var simulation = d3.forceSimulation(library)
    .force("x", d3.forceX(function(d) { return xScale(d['checkoutyear']); }).strength(1))
    .force("y", d3.forceY(function(d) { return yScale(d['checkouts']); }))
    .force("collide", d3.forceCollide(4))
    .stop();

  for (var i = 0; i < 200; ++i) simulation.tick();



  var circle = chartG.selectAll("circle")
    .data(library)
    .enter()
    .append("circle")
    .attr('cx', function(d) {
      return d.x;
    })
    .attr('cy', function(d) {
      return d.y;
    })
    .attr('r', 4)
    .attr('fill', function(d) {
      return materialColors[d.materialtype];
    })
    .attr('fill-opacity', '0.5')
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click", handleMouseClick);
}


function handleMouseClick(d, i) {
  updateHeatmap(d.title);
  console.log("Hi, I am previous i", prevI, "and this is current i", i,
  "and I am second click", secondClick);
  if (i != prevI) {
       tempD = prevD;
       tempI = prevI;
       prevD = d;
       prevI = i;
       return handleClickOut(tempD, tempI, prevD, prevI);
  }
  else {
    if (secondClick == false) {
      secondClick = true;
      return handleClickOut(d, i);
    } else {
      secondClick = false;
      return handleClickOut(d, i, d, i);
    }
  }
}

function updateColorScale(dataset, i) {
    var colorScale;
    var normalizedValue;
    var min;
    var max;
    
    
    chartG.selectAll('circle')
            .transition().duration(1000)
            .attr('fill', function(d) {
                if(i == 0) {
                    if(d.materialtype=="MAGAZINE") {
                        return 'gray';
                    }
                     return yearColors[d.publicationyear];
                } else if (i == 1) {
                    colorScale = d3.scaleSequential(d3.interpolateCool);
                    max = d3.max(dataset, function(d){return +d.checkoutmonth;});
                    min = d3.min(dataset, function(d){return +d.checkoutmonth;});
                    normalizedValue = (+d.checkoutmonth - min) / (max - min);
                    return colorScale(normalizedValue);
                } else if (i == 2){
                    if(d.usageclass == "Digital") {
                        return 'white';
                    } else {
                        return '#7777BB';
                    }
                } else if (i == 3){
                     return materialColors[d.materialtype];
                }

            })
            .transition().duration(2000);
}

var svgLegend = d3.select("svg");

function updateLegendScale(dataset, i) {
    
    if(i == 0){
        svgLegend.select(".legendMonth").remove();
        svgLegend.select(".legendUsage").remove();
        svgLegend.select(".legendMaterial").remove();
        yearScale();
    } else if(i == 1){
        svgLegend.select(".legendYear").remove();
        svgLegend.select(".legendUsage").remove();
        svgLegend.select(".legendMaterial").remove();
        monthScale();
    } else if(i == 2){
        svgLegend.select(".legendMonth").remove();
        svgLegend.select(".legendYear").remove();
        svgLegend.select(".legendMaterial").remove();
        usageScale();
    } else if (i == 3){
        svgLegend.select(".legendMonth").remove();
        svgLegend.select(".legendYear").remove();
        svgLegend.select(".legendUsage").remove();
        materialScale();
    }
}

function monthScale() {
    
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
    var sequentialScale = d3.scaleSequential(d3.interpolateCool)
    .domain([0,12]);

    svgLegend.append("g")
    .attr("class", "legendMonth")
    .attr("transform", "translate(700,60)")
    .attr("fill", "white")
    .style("fill-opacity", "0.5");

    var legendSequential = d3.legendColor()
    .shapeWidth(30)
    .cells(12)
    .orient("horizontal")
    .labels(months)
    .scale(sequentialScale); 

    svgLegend.select(".legendMonth")
    .call(legendSequential);
   
}

function yearScale() {
    
    var years = ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];
    
    var linear = d3.scaleLinear()
    .domain([0,14])
    .range(["#2E00E3", "#2EF8E3"]);

    svgLegend.append("g")
    .attr("class", "legendYear")
    .attr("transform", "translate(700,60)")
    .attr("fill", "white")
    .style("fill-opacity", "0.5");

    var legendLinear = d3.legendColor()
    .shapeWidth(30)
    .cells(14)
    .orient('horizontal')
    .labels(years)
    .scale(linear);

    svgLegend.select(".legendYear")
    .call(legendLinear);
   
}

function usageScale() {
    
    var usage = ["DIGITAL", "PHYSICAL"];
    
    var linear = d3.scaleLinear()
    .domain([0,2])
    .range(["white", "#7777BB"]);

    svgLegend.append("g")
    .attr("class", "legendUsage")
    .attr("transform", "translate(700,60)")
    .attr("fill", "white")
    .style("fill-opacity", "0.5");;

    var legendLinear = d3.legendColor()
    .shapeWidth(30)
    .shapePadding(30)
    .cells(2)
    .orient('horizontal')
    .labels(usage)
    .scale(linear);

    svgLegend.select(".legendUsage")
    .call(legendLinear);
}

function materialScale() {
    
    var materials = ["MIXED", "BOOK", "REGPRINT", "VIDEODISC", "MAGAZINE", "EBOOK", "SOUNDDISC", "SONG"];
    
    var colorRange = ["#fc5a74", "#fee633", "#24d5e8", "#82e92d", "#fc5a74", "#0016FE", "#FE00EE", "#00FEF5"];
    
    var ordinal = d3.scaleOrdinal()
    .domain(materials)
    .range(colorRange);

    svgLegend.append("g")
    .attr("class", "legendMaterial")
    .attr("transform", "translate(700,60)")
    .attr("fill", "white")
    .style("fill-opacity", "0.5");

    var legendOrdinal = d3.legendColor()
    .shapeWidth(30)
    .shapePadding(30)
    .orient('horizontal')
    .scale(ordinal);

    svgLegend.select(".legendMaterial")
    .call(legendOrdinal);
}