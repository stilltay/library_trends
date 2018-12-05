var svgT = d3.select("#tooltip")
    .append("svg")
    .attr("width", 200)
    .attr("height", 800);

var tx = 40; //title x variable
var ty = 25; // title y variable
var tpx = 70; // time period x variable
var tpy = 85; // time period y variable
var cx = 50; //creator x variable
var cy = 105; // creator y variable
var coix = 60; // checkouts x variable
var coiy = 125; // checkouts y variable
var mx = 73; // materialtype x variable
var my = 145; // materialtype y variable
var px = 60; // publisher x variable
var py = 165; // publisher y variable
var pyx = 80; // publisher year x variable
var pyy = 185; // publisher year y variable
var ux = 70; // usage class x variable
var uy = 205; // usage class y variable
var sx = 53; // subjects x variable
var sy = 225; // subjects y variable
var text2 = 310;
var chart2start = 400;
var keepGoing = false;
var prevColor ='';

var months = {1: 'Jan.', 2: 'Feb.', 3: 'Mar.', 4: 'Apr.', 5: 'May', 6: 'June',
  7: 'July', 8: 'Aug.', 9: 'Sept.', 10: 'Oct.', 11: 'Nov.', 12: 'Dec.'}

//FIRST TABLE SETUP
svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', 10)
    .style("fill", "#9f7be1")
    .text('Hovered Checkout');

svgT.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 10)
      .attr('y', ty)
      .style("fill", "#b7b8b8")
    	.text('Title:');

  svgT.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 10)
      .attr('y', tpy)
      .style("fill", "#b7b8b8")
    	.text('Time Period:');

  svgT.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 10)
      .attr('y', cy)
      .style("fill", "#b7b8b8")
    	.text('Creator:');

  svgT.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 10)
      .attr('y', coiy)
      .style("fill", "#b7b8b8")
    	.text('Checkouts:');

  svgT.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 10)
      .attr('y', my)
      .style("fill", "#b7b8b8")
    	.text('Material Type:');

  svgT.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 10)
      .attr('y', py)
      .style("fill", "#b7b8b8")
    	.text('Publisher:');

  svgT.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 10)
      .attr('y', pyy)
      .style("fill", "#b7b8b8")
    	.text('Publication Year:');

  svgT.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 10)
      .attr('y', uy)
      .style("fill", "#b7b8b8")
    	.text('Usage Class:');

  svgT.append('text')
    	.attr('class', 'checkoutInfo')
      .attr('x', 10)
      .attr('y', sy)
      .style("fill", "#b7b8b8")
    	.text('Subjects:');

//SECOND TABLE SETUP
svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', text2 + 10)
    .style("fill", "#9f7be1")
    .text('Clicked Checkout');

svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', ty + text2)
    .style("fill", "#b7b8b8")
    .text('Title:');

svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', tpy + chart2start)
    .style("fill", "#b7b8b8")
    .text('Time Period:');

svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', cy + chart2start)
    .style("fill", "#b7b8b8")
    .text('Creator:');

svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', coiy + chart2start)
    .style("fill", "#b7b8b8")
    .text('Checkouts:');

svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', my + chart2start)
    .style("fill", "#b7b8b8")
    .text('Material Type:');

svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', py + chart2start)
    .style("fill", "#b7b8b8")
    .text('Publisher:');

svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', pyy + chart2start)
    .style("fill", "#b7b8b8")
    .text('Publication Year:');

svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', uy + chart2start)
    .style("fill", "#b7b8b8")
    .text('Usage Class:');

svgT.append('text')
    .attr('class', 'checkoutInfo')
    .attr('x', 10)
    .attr('y', sy + chart2start)
    .style("fill", "#b7b8b8")
    .text('Subjects:');

//MOUSEOVER function
function handleMouseOver(d, i) {
  var tid = "t" + i;
  var tpid = "tp" + i;
  var cid = "c" + i;
  var coid = "f" + i;
  var mid = "m" + i;
  var pid = "p" + i;
  var pyid = "py" + i;
  var uid = "u" + i;
  var sid = "s" + i;
  keepGoing = false;
  var x = String(d.checkoutyear).indexOf('2');
  var refined_year= String(d.checkoutyear).substring(x,x+4);
  svgT.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', tx)
      .attr('y', ty)
      .attr('id', tid)
      .style("fill", "#ffffff")
      .text(d.title)
      .call(wrap, 150);

  svgT.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', tpx)
      .attr('y', tpy)
      .attr('id', tpid)
      .style("fill", "#ffffff")
      .text(months[d.checkoutmonth] + ' ' + refined_year)
      .call(wrap, 150);

  svgT.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', cx)
      .attr('y', cy)
      .attr('id', cid)
      .style("fill", "#ffffff")
      .text(d.creator);

  svgT.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', coix)
      .attr('y', coiy)
      .attr('id', coid)
      .style("fill", "#ffffff")
      .text(d.checkouts);

  svgT.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', mx)
      .attr('y', my)
      .attr('id', mid)
      .style("fill", "#ffffff")
      .text(d.materialtype);

  svgT.append('text')
       .attr('class', 'checkoutInfo')
       .attr('x', px)
       .attr('y', py)
       .attr('id', pid)
       .style("fill", "#ffffff")
       .text(d.publisher);

   svgT.append('text')
        .attr('class', 'checkoutInfo')
        .attr('x', pyx)
        .attr('y', pyy)
        .attr('id', pyid)
        .style("fill", "#ffffff")
        .text(d.publicationyear);

  svgT.append('text')
       .attr('class', 'checkoutInfo')
       .attr('x', ux)
       .attr('y', uy)
       .attr('id', uid)
       .style("fill", "#ffffff")
       .text(d.usageclass);

   svgT.append('text')
         .attr('class', 'checkoutInfo')
         .attr('x', sx)
         .attr('y', sy)
         .attr('id', sid)
         .style("fill", "#ffffff")
         .text(d.subjects)
         .call(wrap, 150);

   var hovered = d3.select(this);
   // add hovered class to style the group
   hovered.classed('hovered', true);
   prevColor = hovered.attr('fill');
   hovered.attr('fill', 'white');
    // highlightSelection(d.title);
}

//MOUSEOUT function
function handleMouseOut(d, i) {
  d3.select("#" + "t" + i).remove();
  d3.select("#" + "tp" + i).remove();
  d3.select("#" + "c" + i).remove();
  d3.select("#" + "f" + i).remove();
  d3.select("#" + "m" + i).remove();
  d3.select("#" + "p" + i).remove();
  d3.select("#" + "py" + i).remove();
  d3.select("#" + "u" + i).remove();
  d3.select("#" + "s" + i).remove();

  var hovered = d3.select(this);
   hovered.classed('hovered', false);
   hovered.attr('fill', prevColor);
  // updateColorScale(getDataset(),getColorScaleIndex());
}

//ON-CLICK function
function tooltipClickIn(d, i) {
  console.log("click was entered");
  keepGoing = true;
  var ctid = "ct" + i;
  var ctpid = "ctp" + i;
  var ccid = "cc" + i;
  var ccoid = "cf" + i;
  var cmid = "cm" + i;
  var cpid = "cp" + i;
  var cpyid = "cpy" + i;
  var cuid = "cu" + i;
  var csid = "cs" + i;
  var x = String(d.checkoutyear).indexOf('2');
  var refined_year= String(d.checkoutyear).substring(x,x+4);
  svgT.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', tx)
      .attr('y', ty + text2)
      .attr('id', ctid)
      .style("fill", "#ffffff")
      .text(d.title)
      .call(wrap, 150);

  svgT.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', tpx)
      .attr('y', tpy + chart2start)
      .attr('id', ctpid)
      .style("fill", "#ffffff")
      .text(months[d.checkoutmonth] + ' ' + refined_year)

  svgT.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', cx)
      .attr('y', cy + chart2start)
      .attr('id', ccid)
      .style("fill", "#ffffff")
      .text(d.creator);

  svgT.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', coix)
      .attr('y', coiy + chart2start)
      .attr('id', ccoid)
      .style("fill", "#ffffff")
      .text(d.checkouts);

  svgT.append('text')
      .attr('class', 'checkoutInfo')
      .attr('x', mx)
      .attr('y', my + chart2start)
      .attr('id', cmid)
      .style("fill", "#ffffff")
      .text(d.materialtype);

  svgT.append('text')
       .attr('class', 'checkoutInfo')
       .attr('x', px)
       .attr('y', py + chart2start)
       .attr('id', cpid)
       .style("fill", "#ffffff")
       .text(d.publisher);

   svgT.append('text')
        .attr('class', 'checkoutInfo')
        .attr('x', pyx)
        .attr('y', pyy + chart2start)
        .attr('id', cpyid)
        .style("fill", "#ffffff")
        .text(d.publicationyear);

  svgT.append('text')
       .attr('class', 'checkoutInfo')
       .attr('x', ux)
       .attr('y', uy + chart2start)
       .attr('id', cuid)
       .style("fill", "#ffffff")
       .text(d.usageclass);

   svgT.append('text')
         .attr('class', 'checkoutInfo')
         .attr('x', sx)
         .attr('y', sy + chart2start)
         .attr('id', csid)
         .style("fill", "#ffffff")
         .text(d.subjects)
         .call(wrap, 150);


}

//CLICKOUT function
function handleClickOut(d, i, d2, i2) {
  d3.select("#" + "ct" + i).remove();
  d3.select("#" + "ctp" + i).remove();
  d3.select("#" + "cc" + i).remove();
  d3.select("#" + "cf" + i).remove();
  d3.select("#" + "cm" + i).remove();
  d3.select("#" + "cp" + i).remove();
  d3.select("#" + "cpy" + i).remove();
  d3.select("#" + "cu" + i).remove();
  d3.select("#" + "cs" + i).remove();
  if (d2 != null) {
      tooltipClickIn(d2, i2);
      highlightSelection(d2.title);
  } else {
    updateColorScale(getDataset(),getColorScaleIndex());
  }
}

//borrowed this wrap function because d3plus plugin for wrapping text was not working
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
          if (lineNumber < 4 || keepGoing) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
          }
        }
    });
}
