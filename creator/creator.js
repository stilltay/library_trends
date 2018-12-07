// Get layout parameters
var svgWidthC = 1000;
var svgHeightC = 650;

var paddingC = {t: 0, r: 40, b: 30, l: 100};

// Compute chart dimensions
var chartWidthC = svgWidthC - paddingC.l - paddingC.r;
var chartHeightC = svgHeightC - paddingC.t - paddingC.b;

 var svgC = d3.select('#creator').append("svg")
    .attr("width", svgWidthC + paddingC.l+paddingC.r)
.attr("height", svgHeightC+ paddingC.t+paddingC.b);

// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeightC / 16;
var barHeight = barBand * 0.7;

// Create a group element for appending chart elements
var chartGC = svgC.append('g')
.attr('transform', 'translate('+[paddingC.l, paddingC.t]+')');

var materialColors = {MIXED: '#fc5a74', BOOK: '#fee633',
   REGPRINT: '#24d5e8', VIDEODISC: '#82e92d', MAGAZINE: '#fc5a74' , EBOOK:'#0016FE', SOUNDDISC:'#FE00EE', SONG:'#00FEF5'};

var yearColors = {2005: '#2E00E3', 2006: '#2E10E3',
    2007: '#2E29E3', 2008: '#2E3FE3', 2009: '#2E56E3', 2010: '#2E6AE3', 2011: '#2E7FE3',
    2012: '#2E97E3', 2013: '#2EA5E3', 2014: '#2EB4E3', 2015: '#2EC6E3', 2016: '#2ED6E3',
    2017: '#2EE8E3', 2018: '#2EF8E3'};

svgC.append('text')
  .attr('class', 'chartTitle')
  .attr('id', 'chartTitle')
  .attr('transform', 'translate(100, 20)')
  .style("fill", "white")
  .style("font-size", "18px")
  .text('Top 10 Checkout Items for ');

var xScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0,500]);

var xAxis = d3.axisBottom(xScale)

svgC.append('g')
  .attr('id', 'x-axis')
  .attr('class', 'x-axis')
  .attr('transform', 'translate(100,450)')
  .attr('stroke', 'white')
  .call(xAxis);

svgC.append('text')
    	.attr('class', 'x-label')
    	.attr('transform', 'translate(325, 480)')
        .style("fill", "white")
    	.text('Total Checkouts');


//////////////////////////////////////TOOLTIP////////////////////////////////////////
var tx2 = 740; //title x variable
var ty2 = 25; // title y variable
var tpx2 = 770; // time period x variable
var tpy2 = 135; // time period y variable
var cx2 = 750; //creator x variable
var cy2 = 155; // creator y variable
var coix2 = 760; // checkouts x variable
var coiy2 = 175; // checkouts y variable
var mx2 = 773; // materialtype x variable
var my2 = 195; // materialtype y variable
var px2 = 760; // publisher x variable
var py2 = 215; // publisher y variable
var pyx2 = 780; // publisher year x variable
var pyy2 = 235; // publisher year y variable
var ux2 = 770; // usage class x variable
var uy2 = 255; // usage class y variable
var sx2 = 753; // subjects x variable
var sy2 = 275; // subjects y variable
var prevColor ='';

var months2 = {1: 'Jan.', 2: 'Feb.', 3: 'Mar.', 4: 'Apr.', 5: 'May', 6: 'June',
  7: 'July', 8: 'Aug.', 9: 'Sept.', 10: 'Oct.', 11: 'Nov.', 12: 'Dec.'}


svgC.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 710)
    .attr('y', 10)
    .style("fill", "#9f7be1")
    .text('Checkout Information');

svgC.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 710)
      .attr('y', ty2)
      .style("fill", "#b7b8b8")
    	.text('Title:');

  svgC.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 710)
      .attr('y', tpy2)
      .style("fill", "#b7b8b8")
    	.text('Time Period:');

  svgC.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 710)
      .attr('y', cy2)
      .style("fill", "#b7b8b8")
    	.text('Creator:');

  svgC.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 710)
      .attr('y', coiy2)
      .style("fill", "#b7b8b8")
    	.text('Checkouts:');

  svgC.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 710)
      .attr('y', my2)
      .style("fill", "#b7b8b8")
    	.text('Material Type:');

  svgC.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 710)
      .attr('y', py2)
      .style("fill", "#b7b8b8")
    	.text('Publisher:');

  svgC.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 710)
      .attr('y', pyy2)
      .style("fill", "#b7b8b8")
    	.text('Publication Year:');

  svgC.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 710)
      .attr('y', uy2)
      .style("fill", "#b7b8b8")
    	.text('Usage Class:');

  svgC.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 710)
      .attr('y', sy2)
      .style("fill", "#b7b8b8")
    	.text('Subjects:');
//////////////////////////////////////TOOLTIP////////////////////////////////////////


 var filteredData;
var barsEnter;
 var nestedFilteredData;
var nestedFilteredDataforScale;


/////////////////////////////////////BUTTONS/////////////////////////////////////////

//container for all buttons
  var allButtons2 = svgC.append("g")
                        .attr("id","allButtons2");

  //labels for buttons
  var labels= ["Publication Year","Usage Class", "Material Type"];

  var defaultColor= "#7777BB";
  var hoverColor= "#0000ff";
  var pressedColor= "#000077";

  var min;
  var max;

  //groups for each button (which will hold a rect and text)
  var buttonGroups2 = allButtons2.selectAll("g.button")
      .data(labels)
      .enter()
      .append("g")
      .attr("class","button")
      .style("cursor","pointer")
          .on("click",function(d,i) {
              updateButtonColors2(d3.select(this), d3.select(this.parentNode));
              updateLegendScale2(nestedFilteredDataforScale, i);
              updateColorScale2(nestedFilteredDataforScale, i);
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

  function updateButtonColors2(button, parent) {
              parent.selectAll("rect")
                      .attr("fill",defaultColor);

              button.select("rect")
                      .attr("fill",pressedColor);
  }

  var bWidth= 100; //button width
  var bHeight= 40; //button height
  var bSpace= 20; //space between buttons
  var x0= 100; //x offset
  var y0= 500; //y offset

  buttonGroups2.append("rect")
                      .attr("class","buttonRect")
                      .attr("width",bWidth)
                      .attr("height",bHeight)
                      .attr("x",function(d,i) {return x0+(bWidth+bSpace)*i;})
                      .attr("y",y0)
                      .attr("rx",5) //rx and ry give the buttons rounded corners
                      .attr("ry",5)
                      .attr("fill",defaultColor);

  buttonGroups2.append("text")
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

/////////////////////////////////////BUTTONS/////////////////////////////////////////


function updateCreatorChart(type, name) {

    svgC.select('#chartTitle')
    	.text('Top 10 Checkout Items for ' + name);


d3.csv('../scatterplot_begins/library.csv', function(error, dataset) {

  if (error) throw error;

    /////////////////////////////////////DATA/////////////////////////////////////

    if(type == "creator"){
        filteredData = dataset.filter(function(d) {
           if(d.creator == name) {
               return d;
           }
        });
    } else if(type == "publisher"){
        filteredData = dataset.filter(function(d) {
            if(d.publisher == name) {
                return d;
            }
        });
    }


    console.log("filtered data");
    console.log(filteredData);

    nestedFilteredData = d3.nest()
        .key(function(d) {
            return d.title;
        }).rollup(function(v) {
            return d3.sum(v, function(d) {
                return d.checkouts;
            });
        })
        .entries(filteredData);
    
    nestedFilteredDataforScale = d3.nest()
        .key(function(d) {
            return d.title;
    }).entries(filteredData);

    console.log("nested filtered data");
    console.log(nestedFilteredData);

    var newData=[];
    console.log(nestedFilteredData[0].key);

    for(var i =0 ; i < nestedFilteredData.length; i++){

        newData.push({
            title: nestedFilteredData[i].key,
            total_checkouts: nestedFilteredData[i].value
        });

    }


    newData.sort(function(a,b) {
        return b.total_checkouts-a.total_checkouts;
    });

    if(newData.length>9){
        newData = newData.slice(0,10);
    }

     console.log("newData");
        console.log(newData);
    
    ///////////////////////////////////DATA////////////////////////////////////

    
    //////////////////////////////////BARCHART/////////////////////////////////
    // **** Draw and Update your chart here ****

    freqExtent = d3.extent(newData, function(d){
		return parseFloat(d.total_checkouts);
	   });

    freqMax = d3.max(newData, function(d){
        return d.total_checkouts;
    });

    console.log("freq");
    console.log(freqMax);

    xScale = d3.scaleLinear()
        .domain([0, freqMax])
        .range([0,500]);

    xAxis = d3.axisBottom(xScale);

        svgC.select('#x-axis')
          .call(xAxis);

    /*
        letterExtent = d3.extent(newData, function(d){
		return d.title;
	       });
    */

        //console.log("letter extent", letterExtent);

    /*
        var yScale = d3.scaleBand()
        .domain([0, 5])
        .rangeRound([40,260])
        .padding(0.5);*/

    var bars = chartGC.selectAll('.bar')
        .data(newData, function(d){
            return d.title;
        });

    barsEnter = bars.enter()
        .append('g')
        .attr('class', 'bar');

	bars.merge(barsEnter)
		.attr('transform', function(d,i){
            return 'translate('+[0, i * barBand + 50]+')';
        });

    console.log("This is barheight", barHeight);

    barsEnter.append('rect')
        .attr('height', barHeight)
        .attr('width', function(d){
            console.log("x-scale");
            console.log(d.total_checkouts);
            console.log(xScale(d.total_checkouts))
            return xScale(d.total_checkouts);
        })
        .style('fill', 'gray')
        .attr('opacity', 0.7)
        .on("mouseover", handleMouseOverBar)
        .on("mouseout", handleMouseOutBar);

         barsEnter.append('text')
        .attr('x', 5)
        .attr('dy', '1.5em')
        .text(function(d){
             var tx = d.title.substring(0, d.title.indexOf("/"));
            return tx;
        })
        .attr('fill', 'white');

        bars.exit().remove();
    
    //////////////////////////////////BARCHART///////////////////////////////////////

});
    

}

//////////////////////////////////////TOOLTIP////////////////////////////////////////

function handleMouseOverBar(d, i) {
  var tid2 = "t" + i + "2";
  var tpid2 = "tp" + i + "2";
  var cid2 = "c" + i + "2";
  var coid2 = "f" + i + "2";
  var mid2 = "m" + i + "2";
  var pid2 = "p" + i + "2";
  var pyid2 = "py" + i + "2";
  var uid2 = "u" + i + "2";
  var sid2 = "s" + i + "2";
  keepGoing = false;
  var x = String(filteredData[i].checkoutyear).indexOf('2');
  var refined_year= String(filteredData[i].checkoutyear).substring(x,x+4);
  svgC.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', tx2)
      .attr('y', ty2)
      .attr('id', tid2)
      .style("fill", "#ffffff")
      .text(d.title)
      .call(wrap, 150);

  svgC.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', tpx2)
      .attr('y', tpy2)
      .attr('id', tpid2)
      .style("fill", "#ffffff")
      .text(months[filteredData[i].checkoutmonth] + ' ' + refined_year)
      .call(wrap, 150);

  svgC.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', cx2)
      .attr('y', cy2)
      .attr('id', cid2)
      .style("fill", "#ffffff")
      .text(filteredData[i].creator);

  svgC.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', coix2)
      .attr('y', coiy2)
      .attr('id', coid2)
      .style("fill", "#ffffff")
      .text(filteredData[i].checkouts);

  svgC.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', mx2)
      .attr('y', my2)
      .attr('id', mid2)
      .style("fill", "#ffffff")
      .text(filteredData[i].materialtype);

  svgC.append('text')
       .attr('class', 'checkoutInfo')
       .attr('x', px2)
       .attr('y', py2)
       .attr('id', pid2)
       .style("fill", "#ffffff")
       .text(filteredData[i].publisher);

   svgC.append('text')
        .attr('class', 'checkoutInfo')
        .attr('x', pyx2)
        .attr('y', pyy2)
        .attr('id', pyid2)
        .style("fill", "#ffffff")
        .text(filteredData[i].publicationyear);

  svgC.append('text')
       .attr('class', 'checkoutInfo')
       .attr('x', ux2)
       .attr('y', uy2)
       .attr('id', uid2)
       .style("fill", "#ffffff")
       .text(filteredData[i].usageclass);

   svgC.append('text')
         .attr('class', 'checkoutInfo')
         .attr('x', sx2)
         .attr('y', sy2)
         .attr('id', sid2)
         .style("fill", "#ffffff")
         .text(filteredData[i].subjects)
         .call(wrap, 150);

   var hovered = d3.select(this);
   // add hovered class to style the group
   hovered.classed('hovered', true);
   prevColor = hovered.attr('fill');
   hovered.attr('fill', 'white');
    // highlightSelection(d.title);
}

function handleMouseOutBar(d, i) {
  d3.select("#" + "t" + i + "2").remove();
  d3.select("#" + "tp" + i + "2").remove();
  d3.select("#" + "c" + i + "2").remove();
  d3.select("#" + "f" + i + "2").remove();
  d3.select("#" + "m" + i + "2").remove();
  d3.select("#" + "p" + i + "2").remove();
  d3.select("#" + "py" + i + "2").remove();
  d3.select("#" + "u" + i + "2").remove();
  d3.select("#" + "s" + i + "2").remove();

  var hovered = d3.select(this);
   hovered.classed('hovered', false);
   hovered.attr('fill', prevColor);
  // updateColorScale(getDataset(),getColorScaleIndex());
}

//////////////////////////////////////TOOLTIP////////////////////////////////////////




/////////////////////////////////////BUTTONS/////////////////////////////////////////////
function updateColorScale2(dataset, i) {
  var colorScale;
  var normalizedValue;
  var min;
  var max;
	//colorScaleIndex = i;

    console.log("i");
    console.log(i);
    
    console.log(dataset);

  chartGC.selectAll('.bar')
        .select('rect')
        .attr('opacity', .7)
        .style('fill', function(d, k) {
            if(i == 0) 
            {
                console.log("dataset value publisher year", dataset[k].values[0].publicationyear);
                if(dataset[k].values[0].materialtype=="MAGAZINE") {
                    return 'gray';
                }
                console.log(yearColors[dataset[k].values[0].publicationyear]);
                 return yearColors[dataset[k].values[0].publicationyear];
            } else if (i == 1){
                console.log("dataset value usageclass", dataset[k].values[0].usageclass);
                if(dataset[k].values[0].usageclass == "Digital") {
                    return 'white';
                } else {
                    return '#7777BB';
                }
            } else if (i == 2){
                console.log("dataset value material type", dataset[k].values[0].materialtype);
                console.log(materialColors[dataset[k].values[0].materialtype]);
                 return materialColors[dataset[k].values[0].materialtype];
            }

        });
}

var svgLegend2 = d3.select("svgC");

function updateLegendScale2(dataset, i) {

    if(i == 0){
        svgLegend2.select(".legendUsage2").remove();
        svgLegend2.select(".legendMaterial2").remove();
        yearScale2();
    } else if(i == 1){
        svgLegend2.select(".legendYear2").remove();
        svgLegend2.select(".legendMaterial2").remove();
        usageScale2();
    } else if (i == 2){
        svgLegend2.select(".legendYear2").remove();
        svgLegend2.select(".legendUsage2").remove();
        materialScale2();
    }
}


function yearScale2() {

    var years = ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"];

    var linear = d3.scaleLinear()
    .domain([0,14])
    .range(["#2E00E3", "#2EF8E3"]);

    svgLegend2.append("g")
    .attr("class", "legendYear2")
    .attr("transform", "translate(200,400)")
    .attr("fill", "white")
    .style("fill-opacity", "0.7");

    var legendLinear = d3.legendColor()
    .shapeWidth(30)
    .cells(14)
    .orient('horizontal')
    .labels(years)
    .scale(linear);

    svgLegend2.select(".legendYear2")
    .call(legendLinear);
}

function usageScale2() {

    var usage = ["DIGITAL", "PHYSICAL"];

    var linear = d3.scaleLinear()
    .domain([0,2])
    .range(["white", "#7777BB"]);

    svgLegend2.append("g")
    .attr("class", "legendUsage2")
    .attr("transform", "translate(200,400)")
    .attr("fill", "white")
    .style("fill-opacity", "0.7");

    var legendLinear = d3.legendColor()
    .shapeWidth(30)
    .shapePadding(30)
    .cells(2)
    .orient('horizontal')
    .labels(usage)
    .scale(linear);

    svgLegend2.select(".legendUsage2")
    .call(legendLinear);
}

function materialScale2() {

    var materials = ["MIXED", "BOOK", "REGPRINT", "VIDEODISC", "MAGAZINE", "EBOOK", "SOUNDDISC", "SONG"];

    var colorRange = ["#fc5a74", "#fee633", "#24d5e8", "#82e92d", "#fc5a74", "#0016FE", "#FE00EE", "#00FEF5"];

    var ordinal = d3.scaleOrdinal()
    .domain(materials)
    .range(colorRange);

    svgLegend2.append("g")
    .attr("class", "legendMaterial2")
    .attr("transform", "translate(200,400)")
    .attr("fill", "white")
    .style("fill-opacity", "0.7");

    var legendOrdinal = d3.legendColor()
    .shapeWidth(30)
    .shapePadding(30)
    .orient('horizontal')
    .scale(ordinal);

    svgLegend2.select(".legendMaterial2")
    .call(legendOrdinal);
}

/////////////////////////////////////BUTTONS/////////////////////////////////////////////