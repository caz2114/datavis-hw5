$(document).ready(function(){
    // Create 2 datasets
    var profit_AA = [
       {Year: "2000-Q1", Domestic: 69607, International: 35476},
       {Year: "2000-Q2", Domestic: 226493, International: 97112},
       {Year: "2000-Q3", Domestic: 189292, International: 126820},
       {Year: "2000-Q4", Domestic: 26417, International: 6786},
       {Year: "2001-Q1", Domestic: -96984, International: 42221},
       {Year: "2001-Q2", Domestic: -473359, International: -36259},
       {Year: "2001-Q3", Domestic: -387386, International: -96568},
       {Year: "2001-Q4", Domestic: -396983, International: -137512},
       {Year: "2002-Q1", Domestic: -1099842, International: -331636},
       {Year: "2002-Q2", Domestic: -412967, International: -72752},
       {Year: "2002-Q3", Domestic: -789387, International: -61523},
       {Year: "2002-Q4", Domestic: -602512, International: -125041}
    ];

    var profit_UA = [
       {Year: "2000-Q1", Domestic: 	-48257, International: -32833},
       {Year: "2000-Q2", Domestic: 268331, International: 	62509},
       {Year: "2000-Q3", Domestic: 	-124854, International: 13711},
       {Year: "2000-Q4", Domestic: 	-105272, International: 18289},
       {Year: "2001-Q1", Domestic: 	-196074, International: -125324},
       {Year: "2001-Q2", Domestic: 	-156296	, International: -137420},
       {Year: "2001-Q3", Domestic: 	-746158, International: -433062},
       {Year: "2001-Q4", Domestic: 	-180248, International: -135627},
       {Year: "2002-Q1", Domestic: 	-307046, International: -188856},
       {Year: "2002-Q2", Domestic: 	-240534, International: -122719},
       {Year: "2002-Q3", Domestic: -630804, International: -280515},
       {Year: "2002-Q4", Domestic: 	-989668, International: -565640}
    ];

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#profit_chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Initialise a X axis:
    var x = d3.scalePoint().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);


    var quarter_tickformat = function(quarter, i){

    if (quarter.slice(-1) === "1"){
    	return quarter;
    	console.log(quarter);
    }
    else {
    	return "";
    	console.log(quarter);
    }

};

// var x = d3.scaleLinear().range([0,width]);
var xAxis = d3.axisBottom().scale(x).tickFormat(quarter_tickformat);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class","myXaxis")

// Initialize an Y axis
// var y = d3.scaleLinear().range([height, 0]);

var yAxis = d3.axisLeft().scale(y);
svg.append("g")
  .attr("class","myYaxis")



var colors = ["rgba(54, 174, 175, 0.65)", "rgba(249, 208, 87, 0.7)"];

var legend = svg.selectAll(".myLegend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(-80," + i * 19 + ")"; });

legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) {return colors.slice()[i];});

legend.append("text")
  .attr("x", width + 5)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .style("font-family", "sans-serif")
  .style("font-size", "13px")
  .style("fill", "white")
  .text(function(d, i) {
    switch (i) {
      case 0: return "Domestic";
      case 1: return "International";
    }
  });
// Create a function that takes a dataset as input and update the plot:
function update(data) {

  // Create the X axis:
  x.domain(data.map(function(d) { return d.Year; }));
  svg.selectAll(".myXaxis").transition()
    .duration(3000)
    .call(xAxis);

  // create the Y axis
  y.domain([d3.min(data, function(d){return d.Domestic}), d3.max(data, function(d) { return d.Domestic  }) ]);
  svg.selectAll(".myYaxis")
    .transition()
    .duration(3000)
    .call(yAxis);


var area = d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x(d.Year); })
  .y0(y(0))
  .y1(function(d) { return y(d.Domestic); });

  // Create a update selection: bind to the new data
  var u = svg.selectAll(".areaD")
    .data([data], function(d){ return d.Year });

var color = d3.scaleOrdinal()
  .domain(["Domestic", "International"])
  // .range(["rgba(0, 0, 200, 0.7)", "rgba(54, 174, 175, 0.65)"]);

  .range(["rgba(54, 174, 175, 0.65)", "rgba(249, 208, 87, 0.7)"]);
  // Updata the line
  u
    .enter()
    .append("path")
    .attr("class","areaD")
    .merge(u)
    .transition()
    .duration(3000)
    .attr("d", d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x(d.Year); })
  .y0(y(0))
  .y1(function(d) { return y(d.Domestic); }))
  .style("fill", function(d) { return color("Domestic"); });

  var v = svg.selectAll(".areaI")
    .data([data], function(d){ return d.Year });

   v
    .enter()
    .append("path")
    .attr("class","areaI")
    .merge(v)
    .transition()
    .duration(3000)
    .attr("d", d3.area()
  .curve(d3.curveMonotoneX)
  .x(function(d) { return x(d.Year); })
  .y0(y(0))
  .y1(function(d) { return y(d.International); }))
  .style("fill", function(d) { return color("International"); });

}

// At the beginning, I run the update function on the first dataset:
update(profit_AA);


$('.company_btn').click(function(){
  var company = $(this).attr('id');
  console.log(company);
  if (company == "AA"){
      update(profit_AA);
  }
    else if (company == "UA"){
      update(profit_UA);
  }

});



});
