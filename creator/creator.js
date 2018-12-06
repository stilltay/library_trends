// Get layout parameters
var svgWidthC = 1000;
var svgHeightC = 500;

var paddingC = {t: 0, r: 40, b: 30, l: 200};

// Compute chart dimensions
var chartWidthC = svgWidthC - paddingC.l - paddingC.r;
var chartHeightC = svgHeightC - paddingC.t - paddingC.b;

 var svgC = d3.select('#creator').append("svg")
    .attr("width", svgWidthC + paddingC.l+paddingC.r)
.attr("height", svgHeightC+ paddingC.t+paddingC.b);

// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeightC / 12;
var barHeight = barBand * 0.7;

// Create a group element for appending chart elements
var chartGC = svgC.append('g')
.attr('transform', 'translate('+[paddingC.l, paddingC.t]+')');

svgC.append('text')
  .attr('class', 'chartTitle')
  .attr('id', 'chartTitle')
  .attr('transform', 'translate(200, 20)')
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
  .attr('transform', 'translate(200,450)')
  .attr('stroke', 'white')
  .call(xAxis);

function updateCreatorChart(type, name) {

    svgC.select('#chartTitle')
    	.text('Top 10 Checkout Items for ' + name);


d3.csv('../scatterplot_begins/library.csv', function(error, dataset) {

  if (error) throw error;

    var filteredData;

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

    var nestedFilteredData = d3.nest()
        .key(function(d) {
            return d.title;
        }).rollup(function(v) {
            return d3.sum(v, function(d) {
                return d.checkouts;
            });
        })
        .entries(filteredData);

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

    var barsEnter = bars.enter()
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
        .attr('opacity', 0.7);

         barsEnter.append('text')
        .attr('x', 5)
        .attr('dy', '1.5em')
        .text(function(d){
             var tx = d.title.substring(0, d.title.indexOf("/"));
            return tx;
        })
        .attr('fill', 'white');

        bars.exit().remove();

});

}
