var svgbar = d3.select("#airportvolbar").attr("class", "svgback");

var margin = {top: 30, right: 40, bottom: 80, left: 50},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    //, "#7b6888"

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

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
        .attr("x", 745)
        .attr("y", 10)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("年份");

    svgbar.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("旅客/人次");

    svgbar.append("g")
        .attr("class", "titlebar")
        .append("text")
        .attr("font-size","20")
        .attr("x", width/2-100)
        .attr("y", height + 50)
        .text("臺灣各國際機場流量比例柱狀圖");

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
            return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });
    
    var legend = svgbar.selectAll(".legend")
        .data(yearnames.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", 25)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", 145)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
});