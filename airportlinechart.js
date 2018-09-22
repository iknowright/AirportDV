var svgline = d3.select("#airportincreaseline").attr("class", "svgback");

var marginline = {top: 20, right: 80, bottom: 30, left: 50},
    widthline = 800 - marginline.left - marginline.right,
    heightline = 600 - marginline.top - marginline.bottom;

var x = d3.time.scale()
    .range([0, widthline]);

var yline = d3.scale.linear()
    .range([heightline, 0]);

var color = d3.scale.ordinal()
    .range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxisline = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format(""));

var yAxisline = d3.svg.axis()
    .scale(yline)
    .orient("left")
    .tickFormat(d3.format("%"));

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return yline(d.rate); });

svgline = d3.select("#airportincreaseline")
    .attr("width", widthline + marginline.left + marginline.right)
    .attr("height", heightline + marginline.top + marginline.bottom)
    .append("g")
    .attr("transform", "translate(" + marginline.left + "," + marginline.top + ")");

d3.csv("airportvolumeyear.csv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

    var data2 = data.filter(function(d,i){
        if(d.year == "2009"){
            return false;
        }
        return true;
    });

    var airports = color.domain().map(function(name) {
        return {
            name: name,
            values: data2.map(function(d,i,arr) {
                if(i == 0)
                    return {year: d.year, rate: +d[name] / data[0][name]};
                else 
                    return {year: d.year, rate: +(d[name] / arr[i-1][name])};
            })
        };
    });



    x.domain(d3.extent(data, function(d) { return d.year; }));

    yline.domain([
        d3.min(airports, function(c) { return d3.min(c.values, function(v) { return v.rate - 0.2;}); }),
        d3.max(airports, function(c) { return d3.max(c.values, function(v) { return v.rate + 0.2;}); })
    ]);

    svgline.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightline + ")")
        .call(xAxisline)
        .append("text")
        .attr("x", 690)
        .attr("y", -15)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("年份");


    svgline.append("g")
        .attr("class", "y axis")
        .call(yAxisline)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Rate/Percentage(%)");

    var lines = svgline.selectAll(".lines")
        .data(airports)
        .enter().append("g")
        .attr("class", "lines");

    lines.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });
  
    // lines.append("text")
    //     .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    //     .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + yline(d.value.rate) + ")"; })
    //     .attr("x", 3)
    //     .attr("dy", ".35em")
    //     .text(function(d) { return d.name; });
  
    lines.selectAll("circle")
      .data(function(d){return d.values})
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", function(d) { return x(d.year); })
      .attr("cy", function(d) { return yline(d.rate); })
      .style("fill", function(d,i,j) {return color(airports[j].name); });
});
