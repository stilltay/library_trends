var svg = d3.select('svg');
var svgWidth = +svg.attr('width') -10;
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 70, b: 110, l: 105};

var svgTB = d3.select("#toolbar").append("svg")
		.attr("width",650)
		.attr("height",120)
    .attr("class","svgTB")
		.append("g")
		.attr("transform", "translate(40 ,"+ padding.t+")");
var svgLegend = svgTB;
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var materialColors = {MIXED: '#fc5a74', BOOK: '#fee633',
   REGPRINT: '#24d5e8', VIDEODISC: '#82e92d', MAGAZINE: '#fc5a74' , EBOOK:'#0016FE', SOUNDDISC:'#FE00EE', SONG:'#00FEF5'};

var yearColors = {2005: '#2E00E3', 2006: '#2E10E3',
    2007: '#2E29E3', 2008: '#2E3FE3', 2009: '#2E56E3', 2010: '#2E6AE3', 2011: '#2E7FE3',
    2012: '#2E97E3', 2013: '#2EA5E3', 2014: '#2EB4E3', 2015: '#2EC6E3', 2016: '#2ED6E3',
    2017: '#2EE8E3', 2018: '#2EF8E3'};

//variables for onclick handler
var prevD;
var prevI = -1;
var secondClick = false;
var input1;
var colorScaleIndex = 0;

//Axis Variable
var yAxisG = svg.append('g')
                .attr('class', 'y-axis')
                .attr('transform', 'translate(110, 50)')
                .attr('stroke', 'white');

var xAxisG = svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(100,740)')
    .attr('stroke', 'white');

d3.csv('./library.csv', function(error, dataset) {


  library = dataset;
  parseTime = d3.timeParse("%Y");

  library.forEach(function(d) {
    d.checkoutyear = parseTime(d.checkoutyear);
    d.checkouts = +d.checkouts;
  });

  svg.append('text')
    	.attr('class', 'x-label')
      .attr('id','x-label')
    	.attr('transform', 'translate(710, 800)')
      .style("fill", "white")
    	.text('Checkout Year');

  svg.append('text')
    	.attr('class', 'y-label')
      .attr('id','y-label')
      .attr('transform', 'translate(20, 480) rotate(-90)')
      .style("fill", "white")
    	.text('Frequency of Checkouts/Month');

  //container for all buttons
  var allButtons= svgTB.append("g")
                        .attr("id","allButtons");

  //labels for buttons
  var labels= ["Publication Year","Checkout Month","Usage Class", "Material Type", "Checkout Year"];

  defaultColor= "#7777BB";
  hoverColor= "#0000ff";
  pressedColor= "#000077";

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

  var bWidth= 100; //button width
  var bHeight= 40; //button height
  var bSpace= 20; //space between buttons
  var x0= 0; //x offset
  var y0= -20; //y offset

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

  domainMap = {};

  dataset.columns.forEach(function(column)
  {
    if(column=="checkouts" || column =="publicationyear" || column == "checkoutmonth" || column=="checkoutyear")
    {
        domainMap[column] = d3.extent(dataset, function(data_element)
        {
          if (column== "checkouts" || column == "checkoutmonth")
          {
            return Number(data_element[column]);
          }

          else if(data_element[column]!='' && column=="publicationyear")
          {
            return Number(parseTime(data_element[column]));
          }
          else if(column=="checkoutyear")
          {
            return Number(data_element[column]);
          }
        });
    }
  });

  chartScales = {x: 'checkoutyear', y: 'checkouts'};
  updateChart();

});

function highlightSelection(search) {
  chartG.selectAll('circle')
    .attr('fill', function(d) {
      if (search === d.title || search === d.publisher || search === d.creator) {
        return "#dada4a";
      } else {
        return "gray";
      }
    })
    .attr('opacity', function(d) {
      if (search === d.title || search === d.publisher || search === d.creator) {
        return "1";
      } else {
        return ".7";
      }
    })
    .attr('r', function(d) {
      if (search === d.title || search === d.publisher || search === d.creator) {
        return 6;
      } else {
        return 4;
      }
    })
}

function updateChart() {

          //Updating Y-axis scale based on User Input
          if(chartScales.y=="publicationyear" || chartScales.y=="checkoutyear")
          {
              yScale=d3.scaleTime();
              yScale.domain(domainMap[chartScales.y]);
              yScale.range([chartHeight-20, 0]);
          }
          else if (chartScales.y=="usageclass" || chartScales.y=="materialtype")
          {
              yScale=d3.scaleOrdinal();

              if(chartScales.y=="materialtype")
              {
                yScale.domain(['BOOK','EBOOK','MIXED','REGPRINT','MAGAZINE','SOUNDDISC','SONG','VIDEODISC'])
                      .range([chartHeight-20,(chartHeight-20)/7, 2*(chartHeight-20)/7, 3*(chartHeight-20)/7, 4*(chartHeight-20)/7, 5*(chartHeight-20)/7, 6*(chartHeight-20)/7, 0]);
              }
              else
              {
                yScale.domain(['PHYSICAL','DIGITAL']);
                yScale.range([(chartHeight-20)/7, 6*(chartHeight)/7]);
              }
          }
          else if (chartScales.y=="checkouts" || chartScales.y == "checkoutmonth")
          {
              yScale = d3.scaleLinear();
              //console.log(domainMap[chartScales.y]);
              yScale.domain(domainMap[chartScales.y]);
              yScale.range([chartHeight-20, 0]);
          }

          //Updating X-axis scale based on User Input
          if(chartScales.x=="publicationyear" || chartScales.x=="checkoutyear")
          {
              xScale=d3.scaleTime();
              xScale.domain(domainMap[chartScales.x])
                    .range([20, chartWidth]);
          }
          else if (chartScales.x=="usageclass" || chartScales.x=="materialtype")
          {
              xScale=d3.scaleOrdinal();

              if(chartScales.x=="materialtype")
              {
                xScale.domain(['BOOK','SONG','SOUNDDISC','MAGAZINE','REGPRINT','MIXED','EBOOK','VIDEODISC'])
                      .range([60, 60 + (chartWidth-60)/7, 60+(2*(chartWidth-60))/7, 60+(3*(chartWidth-60))/7, 60+(4*(chartWidth-60))/7, 60+(5*(chartWidth-60))/7, 60+(6*(chartWidth-60))/7, chartWidth]);
              }
              else
              {
                xScale.domain(['PHYSICAL', 'DIGITAL']);
                xScale.range([ chartWidth/7, 6*(chartWidth)/7]);
              }
          }
          else if (chartScales.x=="checkouts" || chartScales.x == "checkoutmonth")
          {
              xScale = d3.scaleLinear();
              xScale.domain(domainMap[chartScales.x])
                     .range([20, chartWidth]);
          }

          yAxisG.transition()
            .duration(800)
            .call(d3.axisLeft(yScale));
          xAxisG.transition()
            .duration(800)
            .call(d3.axisBottom(xScale));

          var simulation = d3.forceSimulation(library)
            .force("x", d3.forceX(function(d) {
                    if(chartScales.x!="publicationyear" && chartScales.x!="checkoutyear ")
                      return xScale(d[chartScales.x]);
                    else
                      return xScale(parseTime(d[chartScales.x]));
                  }).strength(1)
            )
            .force("y", d3.forceY(function(d) {
                    if(chartScales.y!="publicationyear" && chartScales.y!="checkoutyear ")
                      return yScale(d[chartScales.y]);
                    else
                      return yScale(parseTime(d[chartScales.y]));
                  }).strength(1)
            )
            .force("collide", d3.forceCollide(5))
            .stop();

          for (var i = 0; i < 50; ++i)
            {
                simulation.tick();
            }

          var titles = chartG.selectAll('.title')
                             .data(library);

          var titlesEnter = titles.enter()
            .append('g')
            .attr('class', 'title')
            .attr('transform', function(d)
            {
               if(chartScales.x!="publicationyear")
                  {
                    var tx = xScale(d[chartScales.x]);
                  }
                else if (chartScales.x=="publicationyear")
                  {
                    var tx = xScale(parseTime(d[chartScales.x]));
                  }

                if(chartScales.y!="publicationyear")
                  {
                    var ty = yScale(d[chartScales.y]);
                  }
                else if (chartScales.y=="publicationyear")
                  {
                    var ty = yScale(parseTime(d[chartScales.y]));
                  }
                return 'translate('+[tx, ty]+')';
            });

            titlesEnter.append('circle')
              .attr('r', 6)
              .attr('fill', function(d) {
                return materialColors[d.materialtype];
              })
              .attr('fill-opacity', '0.5')
              .on("mouseover", handleMouseOver)
              .on("mouseout", handleMouseOut)
              .on("click", handleMouseClick);

            titles.merge(titlesEnter)
              .transition()
              .duration( function(){
                if(chartScales.x =="usageclass" || chartScales.y == "usageclass"){
                  return 5000;
                }
                else
                {
                  return 3000;
                }
              })
              .attr('transform', function(d) {
                  return 'translate('+[d.x, d.y]+')';
              });

}

function updateButtonColors(button, parent) {
              parent.selectAll("rect")
                      .attr("fill",defaultColor);

              button.select("rect")
                      .attr("fill",pressedColor);
  }

function handleMouseClick(d, i) {
  
   updateHeatmap(d.title); 
   var type;
   var name;

   if(d.materialtype == "BOOK" || d.materialType == "EBOOK" || d.materialType == "SONG") 
   {
       type = "creator";
       name = d.creator;
   } 
   else 
   {
       type = "publisher";
       name = d.publisher;
   }

   updateCreatorChart(type, name); 
    if (i != prevI) 
    {
       tempD = prevD;
       tempI = prevI;
       prevD = d;
       prevI = i;
       return handleClickOut(tempD, tempI, prevD, prevI);
    }
    else 
    {
      if (secondClick == false) 
      {
        secondClick = true;
        return handleClickOut(d, i);
      } 
      else 
      {
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
	colorScaleIndex = i;


  chartG.selectAll('circle')
        .transition().duration(2000)
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
    .attr("transform", "translate(100,45)")
    .attr("fill", "white")
    .style("fill-opacity", "1");

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
    .attr("transform", "translate(70,45)")
    .attr("fill", "white")
    .style("fill-opacity", "1");

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
    .attr("transform", "translate(245,45)");

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
    .attr("transform", "translate(60,45)");

    var legendOrdinal = d3.legendColor()
    .shapeWidth(30)
    .shapePadding(30)
    .orient('horizontal')
    .scale(ordinal);

    svgLegend.select(".legendMaterial")
    .call(legendOrdinal);
}

function onYScaleChanged() {
    var select = d3.select('#yScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.y = select.options[select.selectedIndex].value
    //Updating AxisLabel
    var newLabel
    if(select.options[select.selectedIndex].value=="checkoutmonth")
    {
      newLabel = "Checkout Month";
    }
    else if(select.options[select.selectedIndex].value=="checkoutyear")
    {
      newLabel = "Checkout Year";
    }
    else if(select.options[select.selectedIndex].value=="usageclass")
    {
      newLabel = "Usage Class";
    }
    else if(select.options[select.selectedIndex].value=="checkouts")
    {
      newLabel = "Frequency of Checkouts/Month";
    }
    else if(select.options[select.selectedIndex].value=="publicationyear")
    {
      newLabel = "Publication Year";
    }
    else if(select.options[select.selectedIndex].value=="materialtype")
    {
      newLabel = "Material Type";
    }
    document.getElementById('y-label').textContent = newLabel;
    // Update chart
    updateChart();
}

function onXScaleChanged() {
    var select = d3.select('#xScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.x = select.options[select.selectedIndex].value;
    //Updating AxisLabel
    var newLabel
    if(select.options[select.selectedIndex].value=="checkoutmonth")
    {
      newLabel = "Checkout Month";
    }
    else if(select.options[select.selectedIndex].value=="checkoutyear")
    {
      newLabel = "Checkout Year";
    }
    else if(select.options[select.selectedIndex].value=="usageclass")
    {
      newLabel = "Usage Class";
    }
    else if(select.options[select.selectedIndex].value=="checkouts")
    {
      newLabel = "Frequency of Checkouts/Month";
    }
    else if(select.options[select.selectedIndex].value=="publicationyear")
    {
      newLabel = "Publication Year";
    }
    else if(select.options[select.selectedIndex].value=="materialtype")
    {
      newLabel = "Material Type";
    }
    document.getElementById('x-label').textContent = newLabel;
    // Update chart
    updateChart();
}

function getDataset() {
  return library;
}

function getColorScaleIndex() {
  return colorScaleIndex;
}
