//Taiwan Map
var width = 800,
    height = 600;

var svg = d3.select("#taiwanmap")
    .attr("width", width)
    .attr("height", height)
    .attr("class","svgback");

var projection = d3.geo.mercator()
    .center([121,24])
    .scale(6000);

var path = d3.geo.path()
    .projection(projection);

d3.json("country.topojson", function(error, topology) {
    var g = svg.append("g");
    
    // 縣市/行政區界線
    d3.select("#taiwanmap").append("path").datum(
        topojson.mesh(topology,
                topology.objects["COUNTY_MOI_1070516"], function(a,
                        b) {
                    return a !== b;
                })).attr("d", path).attr("class","subunit-boundary"); 

    var features = topojson.feature(topology, topology.objects.COUNTY_MOI_1070516).features;
    d3.select("g").selectAll("path")
        .data(topojson.feature(topology, topology.objects.COUNTY_MOI_1070516).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr({
            d : path,
            id : function(d) {
                return d.properties["COUNTYNAME"];
            },
            fill : '#55AA00'
        });

    var color2 = d3.scale.linear().domain([0,100000]).range(["#ffc7d1","#ff738e"]);
    // load and display the cities
    d3.csv("airport.csv", function(error, data) {
        svg.append("text")
        .attr("x","50")
        .attr("y","75")
        .attr("font-family","sans-serif")
        .attr("font-size","50")
        .attr("id","airportname");

        svg.append("text")
        .attr("x","50")
        .attr("y","135")
        .attr("font-family","sans-serif")
        .attr("font-size","50")
        .attr("id","airportcapacity");

        g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return projection([d.lon, d.lat])[0]-1.5;
        })
        .attr("y", function(d) {
            return projection([d.lon, d.lat])[1] - 17;
        })
        .attr("height", 17)
        .attr("width", 3)
        .style("fill","black");
        
        g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                    return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                    return projection([d.lon, d.lat])[1] - 20;
            })
            .attr("r", 8)
            .style("fill",function(d) {
                return color2(d.volume);
            });
    });

    //drawing taiwan density
    svg.append("text")
        .attr("x","600")
        .attr("y","200")
        .attr("font-family","sans-serif")
        .attr("font-size","50")
        .attr("id","name");
    svg.append("text")
        .attr("x","600")
        .attr("y","260")
        .attr("font-family","sans-serif")
        .attr("font-size","50")
        .attr("id","density");
    
    var density = {
        "臺北市":	9838.36
        ,"嘉義市":	4480.97
        ,"新竹市":	4258.95
        ,"基隆市":	2791.62
        ,"新北市":	1943.37
        ,"桃園市":	1808.45
        ,"臺中市":	1262.40
        ,"彰化縣":	1190.39
        ,"高雄市":	939.58
        ,"金門縣":  909.64
        ,"臺南市":	859.90
        ,"澎湖縣":	820.10
        ,"雲林縣":	533.42
        ,"連江縣":	454.03
        ,"新竹縣":	388.83
        ,"苗栗縣":	302.60
        ,"屏東縣":	298.34
        ,"嘉義縣":	267.24
        ,"宜蘭縣":	212.69
        ,"南投縣":	121.48
        ,"花蓮縣":	71.02
        ,"臺東縣":	62.47
    };
    for(var i = features.length - 1; i >= 0; i-- ) {
        features[i].properties.density = density[features[i].properties.COUNTYNAME];
    }
    var color = d3.scale.linear().domain([0,10000]).range(["#f1c550","#be3030"]);
    d3.select("#taiwanmap").selectAll("path").data(features).attr({
        d: path,
        fill: function(d) {
            if(d.properties.density <= 1000) return color(5000);
            else if (d.properties.density > 1000 && d.properties.density <= 2500) return color(6750);
            else if (d.properties.density > 2500 && d.properties.density <= 5000) return color(8250);
            else if (d.properties.density > 5000) return color(10000);
            }
        })
        .on("mouseenter", function(d) {
            $("#name").text(d.properties.COUNTYNAME);
            $("#density").text(d.properties.density);
            $("#" + d.properties.COUNTYNAME).attr({opacity:0.75});
            console.log("enter");
        })
        .on("mouseout", function(d) {
            $("#name").text("");
            $("#density").text("");
            $("#" + d.properties.COUNTYNAME).attr({opacity:1});
            console.log("out");
        });
});