$(document).ready(function(){
var margin = {top: 20, right: 30, bottom: 30, left: 70},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#passengers")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "no-hover")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  // tooltip.append("rect")
  //   .attr("x", -35)
  //   .attr("width", 100)
  //   .attr("height", 20)
  //   .attr("fill", "white")
  //   .style("opacity", 1);

  tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")

d3.csv("https://raw.githubusercontent.com/caz2114/datavis-hw5/master/data/annual_passengers_new.csv").then
(  function (data) {

//   function tweenDash() {
//     var l = this.getTotalLength(),
//         i = d3.interpolateString("0," + l, l + "," + l);
//     return function (t) { return i(t); };
//   };

//   function transition(path) {
//     d3.selectAll(".multi-lines").each(function(d,i){
//       d3.select(this).transition()
//         .attr("stroke-width", "3px")
//         .delay(i*250)
//         .duration(2000)
//         .attrTween("stroke-dasharray", tweenDash);
//     })
//   };

  var x = d3.scaleLinear()
    //.domain(d3.extent(data, d => d.year))
    .domain([1990, 2010])
    .range([0, width]);
  var x_axis = d3.axisBottom()
        .scale(x);

	svg.append("g")
    .attr("class", "x_axis")
		.attr("transform", "translate(0, " + height + ")")
    .call(x_axis);
  //add a x-axis title
  svg.append("text")
        .attr("x", width)
        .attr("y", height-margin.bottom/2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("fill","white")
        .text("Year");

  var y = d3.scaleLinear()
    //.domain(d3.extent(data, d => d.percentage))
    .domain([0, 110000000])
    .range([ height , 2*margin.top]);
  var y_axis = d3.axisLeft()
    .scale(y);
  svg.append("g")
    .attr("class", "y_axis")
  //.attr("transform", "translate(10, 0)")
    .call(y_axis);
  //add a y-axis title
  svg.append("text")
        .attr("x", 0)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("fill", "white")
        .attr("class","test1")
        .text("Count");

    svg.append("line")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", 10)
    .attr("x1", 2001)
    .attr("x2", 2001)
    .attr("y1", height/2+10)
    .attr("y2", height-margin.bottom);

  var colorScale = d3.scaleOrdinal()
    .domain(["WN", "AA", "DL", "UA", "US", "NW","divider"])
    .range(["#eb3d77", "#42aeab", "#5fb9e9", "#fce63f", "#9b5209","#4688B8","#FF0000"]);

  var drawline = d3.line()
    .x(function(d) {return x(d.year); })
    .y(function(d) {return y(d.count); })
    .curve(d3.curveMonotoneX);

  var multiLineData = d3.nest()
    .key(d => d.category)
    .entries(data);

  var lineGroup = svg.append("g")
    .attr("class", "line-group");

  svg.select("g.line-group")
      .selectAll("g")
      .data(multiLineData)
      .enter()
      .append("path")
      .attr("class", function(d) {
        if (d.key == "divider") {
          return "divider";
        }
        else {
          return "multi-lines";
        }
      })
      .attr("fill", "none")
      .attr("d", function(d) {return drawline(d.values); })
      .attr("stroke", function(d) { return colorScale(d.key); })

      .attr("stroke-width", function(d) {
        if (d.key == "divider") {
          return "2px";
        }
        else {
          return "3px";
        }
      })
      .attr("stroke-dasharray", function(d) {
         if (d.key == "divider") {
           return ("3, 3");
         }
      })
      .on("mouseover", function(){
          d3.selectAll(".multi-lines").transition()
            .duration(300)
            .attr("opacity", 0.25);
          d3.select(this).transition()
            .duration(300)
            .attr("opacity", 1);
          tooltip.style("display", null);
          var firstChild = this.parentNode.parentNode.firstChild;
          if (d3.select(firstChild).attr("class") == "tooltip") {
            this.parentNode.parentNode.insertBefore(this.parentNode, firstChild);
          }
      })
      .on("mousemove", function(d) {
    if(d.key!="divider"){
          const year = Math.floor(x.invert(d3.mouse(this)[0]));
          const count = Math.floor(y.invert(d3.mouse(this)[1]));
          var xPosition = parseInt(d3.mouse(this)[0] - 15);
          var yPosition = parseInt(d3.mouse(this)[1] - 25);
          tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
          tooltip.select("text").text("Airline: "+d.key+" Year: "+year +" Count: "+ count);}
     })


      .on("mouseout", function() {
          d3.selectAll(".multi-lines").transition()
            .duration(300)
            .attr("opacity", 1);
          tooltip.style("display", "none");
      });
      //.call(transition);

  var legend_keys = ["WN", "AA", "DL", "UA", "US", "NW"];

  var lineLegend = svg.selectAll(".lineLegend")
                      .data(legend_keys)
                      .enter().append("g")
                      .attr("class","lineLegend")
                      .attr("transform", function (d,i) {
                        return "translate(" +width*0.95 + "," + (i*20)+")";
                      });

  lineLegend.append("text").text(function (d) {return d;})
    .attr("transform", "translate(20,10)") //align texts with boxes

  lineLegend.append("rect")
    .attr("fill", function (d, i) {return colorScale(d); })
    .attr("width", 10)
    .attr("height", 10)
});

  svg.append("text")
	  .attr("fill", "red")
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("font-weight", "bold")
    .attr("x", width/2+40)
    .attr("y", height*0.12)
    .text("911 Attack");
});
