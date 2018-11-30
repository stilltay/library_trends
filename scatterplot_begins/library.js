var svg = d3.select('svg');
var svgWidth = +svg.attr('width') - 260;
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
    .attr('stroke', 'white')
    .call(xAxis);

  svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(70, 40)')
      .attr('stroke', 'white')
      .call(yAxis);

  svg.append('text')
    	.attr('class', 'x-label')
    	.attr('transform', 'translate(500, 590)')
      .style("fill", "white")
    	.text('Year');

  svg.append('text')
    	.attr('class', 'y-label')
      .attr('transform', 'translate(20, 300) rotate(-90)')
      .style("fill", "white")
    	.text('Frequency of Checkouts)');

  svg.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('transform', 'translate(1000, 100)')
      .style("fill", "white")
    	.text('Title:');

  svg.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('transform', 'translate(1000, 130)')
      .style("fill", "white")
    	.text('Creator:');

  svg.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('transform', 'translate(1000, 160)')
      .style("fill", "white")
    	.text('Frequency:');

  svg.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('transform', 'translate(1000, 190)')
      .style("fill", "white")
    	.text('Material Type:');

  svg.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('transform', 'translate(1000, 220)')
      .style("fill", "white")
    	.text('Publisher:');

  svg.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('transform', 'translate(1000, 250)')
      .style("fill", "white")
    	.text('Publication Year:');

  svg.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('transform', 'translate(1000, 280)')
      .style("fill", "white")
    	.text('Subjects:');

    updateChart();
});

function updateChart() {
  var circle = chartG.selectAll("circle")
    .data(library)
    .enter()
    .append("circle")
    .attr('cx', function(d) {
      return xScale(d.checkoutyear);
    })
    .attr('cy', function(d) {
      return yScale(d.checkouts);
    })
    .attr('r', 4)
    .attr('fill', function(d) {
      return materialColors[d.materialtype];
    })
    .attr('fill-opacity', '0.35')
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
}

 function handleMouseOver(d, i) {
   var tid = "t" + i;
   var cid = "c" + i;
   var fid = "f" + i;
   var mid = "m" + i;
   var pid = "p" + i;
   var pyid = "py" + i;
   var sid = "s" + i;


   svg.append('text')
       .attr('class', 'checkoutInfo')
       .attr('transform', 'translate(1040, 100)')
       .attr('id', tid)
       .style("fill", "white")
       .text(d.title);

   svg.append('text')
       .attr('class', 'checkoutInfo')
       .attr('transform', 'translate(1060, 130)')
       .attr('id', cid)
       .style("fill", "white")
       .text(d.creator);

   svg.append('text')
       .attr('class', 'checkoutInfo')
       .attr('transform', 'translate(1060, 160)')
       .attr('id', fid)
       .style("fill", "white")
       .text(d.frequency);

       svg.append('text')
           .attr('class', 'checkoutInfo')
           .attr('transform', 'translate(1100, 190)')
           .attr('id', mid)
           .style("fill", "white")
           .text(d.materialtype);

       svg.append('text')
            .attr('class', 'checkoutInfo')
            .attr('transform', 'translate(1070, 220)')
            .attr('id', pid)
            .style("fill", "white")
            .text(d.publisher);

        svg.append('text')
             .attr('class', 'checkoutInfo')
             .attr('transform', 'translate(1120, 250)')
             .attr('id', pyid)
             .style("fill", "white")
             .text(d.publicationyear);

        svg.append('text')
              .attr('class', 'checkoutInfo')
              .attr('transform', 'translate(1060, 280)')
              .attr('id', sid)
              .style("fill", "white")
              .text(d.subjects);

        // d3plus.textWrap()
        //    .container(d3.select("#checkoutInfo"))
        //    .draw();
 }

 function handleMouseOut(d, i) {
   d3.select("#" + "t" + i).remove();
   d3.select("#" + "c" + i).remove();
   d3.select("#" + "f" + i).remove();
   d3.select("#" + "m" + i).remove();
   d3.select("#" + "p" + i).remove();
   d3.select("#" + "py" + i).remove();
   d3.select("#" + "s" + i).remove();

}
