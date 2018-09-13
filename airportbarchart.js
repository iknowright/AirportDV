var svgbar = d3.select("#airportvolbar").attr("class", "svgback");

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888"]);
    //, "#7b6888"

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".1s"));

svgbar = d3.select("#airportvolbar")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("airportvolumeyear.csv", function(error, data){
    var yearnames = d3.keys(data[0]).filter(function(key) { return key !== "year"; });
    data.forEach(function(d) {
        d.years = yearnames.map(function(name) { return {name: name, value: +d[name]}; });
    });
    x0.domain(data.map(function(d) { return d.year; }));
    x1.domain(yearnames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.years, function(d) { return d.value; }); })]);

    svgbar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("x", 900)
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("year");

    svgbar.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Volume/Persons");

    var yearSvg = svgbar.selectAll(".year")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.year) + ",0)"; });

    yearSvg.selectAll("rect")
        .data(function(d) { return d.years; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { 
            console.log(d.name); 
            console.log(d.value); 
            return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });
});