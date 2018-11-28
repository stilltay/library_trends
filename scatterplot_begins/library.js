var svg = d3.select('svg');
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 40, b: 40, l: 70};

var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var materialColors = {MIXED: '#fc5a74', BOOK: '#fee633',
    REGRPRINT: '#24d5e8', VIDEODISC: '#82e92d', MAGAZINE: '#fc5a74'};


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

  xScale = d3.scaleTime()
    .domain(yearsExtent)
      .range([0, chartWidth]);

  var frequencyExtent = d3.extent(library, function(d) {
      return Number(d['checkouts']);
  });

  yScale = d3.scaleLinear()
    .domain(frequencyExtent)
      .range([chartHeight, 0]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);


  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(70,560)')
    .attr('stroke', 'black')
    .call(xAxis);

  svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(70, 40)')
      .attr('stroke', 'black')
      .call(yAxis);

  svg.append('text')
    	.attr('class', 'x-label')
    	.attr('transform', 'translate(500, 590)')
      .style("fill", "black")
    	.text('Year');

  svg.append('text')
    	.attr('class', 'y-label')
      .attr('transform', 'translate(20, 300) rotate(-90)')
      .style("fill", "black")
    	.text('Frequency of Checkouts)');

    updateChart();
});

function updateChart() {
  var circle = chartG.selectAll("circle")
    .data(library)
    .enter()
    .append("circle")
    .on('mouseover', function(d) {
        // Use this to select the hovered element
        var hovered = d3.select(this);
        // add hovered class to style the group
        hovered.classed('hovered', true);
        // add a new text value element to the group
        hovered.append('text')
            .attr('class', 'value')
            .attr('x', xScale(d.checkoutyear) + 10)
            .attr('dy', '0.7em')
            .text(d.title);
    })
    .on('mouseout', function(d) {
        // Clean up the actions that happened in mouseover
        var hovered = d3.select(this);
        hovered.classed('hovered', false);
        hovered.select('text.value').remove();
    })
    .attr('cx', function(d) {
      return xScale(d.checkoutyear);
    })
    .attr('cy', function(d) {
      return yScale(d.checkouts);
    })
    .attr('r', 2)
    .attr('fill', function(d) {
      return materialColors[d.materialtype];
    })
    .attr('fill-opacity', '0.35')

    chartG.append('text')
        .attr('y', -10)
        .text(function(d) {
            return d.title;
        });
    //
    // // ENTER + UPDATE selections - bindings that happen on all updateChart calls
    // dots.merge(dotsEnter)
    //     .transition() // Add transition - this will interpolate the translate() on any changes
    //     .duration(750)
    //     .attr('transform', function(d) {
    //         // Transform the group based on x and y property
    //         var tx = xScale(d[chartScales.x]);
    //         var ty = yScale(d[chartScales.y]);
    //         return 'translate('+[tx, ty]+')';
    //     });
}
