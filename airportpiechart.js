var svgHeight = 400,
    svgWidth = 800,
    radius = (svgHeight - 50) / 2;

var pieData = [
    {airport : "桃園國際機場", volume : 44878703},
    {airport : "高雄國際機場", volume : 5184918},
    {airport : "臺北松山機場", volume : 3148119},
    {airport : "台中國際機場", volume : 1400596}
];

var svgPie  = d3.select("#airportvolpie")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .attr("class", "svgback")
    .append("g")
    .attr("transform", "translate(" + radius + "," + (radius + 50) + ")") ;

var colorbar = d3.scale.ordinal()
    .range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d){ return d.volume; });

var g = svgPie.selectAll("fan")
    .data(pie(pieData))
    .enter()
    .append("g")
    .attr("class", "fan");

g.append("path")
    .attr("d", arc)
    .attr("fill", function(d){ return colorbar(d.data.airport); })


var legend = svgPie.selectAll(".legendpie")
    .data(pie(pieData))
    .enter().append("g")
    .attr("class", "legendpie")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", radius)
    .attr("y", radius / 2 + 10)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d){ return colorbar(d.data.airport); });

legend.append("text")
    .attr("x", radius + 120)
    .attr("y", radius / 2 + 17.5)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d.data.airport; });

svgPie.append("g")
    .attr("class", "titlepie")
    .append("text")
    .attr("font-size","20")
    .attr("x",0)
    .attr("y", -radius - 15)
    .text("臺灣各國際機場之群組圓餅圖");

