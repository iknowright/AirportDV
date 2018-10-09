//Taiwan Map
var width = 800,
    height = 600;

var svg = d3.select("#taiwanmap")
    .attr("class","svgback")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.mercator()
    .center([121,24])
    .scale(6000);

var path = d3.geo.path()
    .projection(projection);

d3.json("src/country.topojson", function(error, topology) {
    var g = svg.append("g");
    
    // City Borders 
    d3.select("#taiwanmap").append("path").datum(
        topojson.mesh(topology,
                topology.objects["COUNTY_MOI_1070516"], function(a,
                        b) {
                    return a !== b;
                })).attr("d", path).attr("class","subunit-boundary"); 

    //Map showing here
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
            //default color
            //fill : '#55AA00'
    });

    //drawing taiwan density
    //tooltip div
    var imageTooltip = svg.append('svg:image')
        .attr({
        //'xlink:href': 'tpe.png', 
        class : "tooltipmap",
        x: 25,
        y: height - 250,
        width: 200,
        height: 150
        });

    svg.append("text")
        .attr("x","25")
        .attr("y",height - 100)
        .attr("font-family","sans-serif")
        .attr("font-size","45")
        .attr("id","name");
    svg.append("text")
        .attr("x","25")
        .attr("y",height - 50)
        .attr("font-family","sans-serif")
        .attr("font-size","40")
        .attr("id","density");

    svg.append("text")
        .attr("x","25")
        .attr("y",height-50)
        .attr("font-family","sans-serif")
        .attr("font-size","40")
        .attr("id","airporttext");

    svg.append("text")
    .attr("y",50)
    .attr("font-family","sans-serif")
    .attr("font-size","15")
    .attr("id","airporttext")
    .text("國際機場位置與各縣市人口密度關係圖")
    .attr("x",function(){
        var text_width = this.getComputedTextLength();
        return width/2 - text_width/2}
    );
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
    var color = d3.scale.log().domain([1,10000]).range(["#f1c550","#be3030"]);
    d3.select("#taiwanmap").selectAll("path").data(features).attr({
        d: path,
        fill: function(d) {
            return color(d.properties.density)
            }
        })
        .on("mouseenter", function(d) {
            $("#name").text(d.properties.COUNTYNAME);
            $("#density").text(d.properties.density+" 人/平方公里");
            $("#" + d.properties.COUNTYNAME).attr({opacity:0.75});
        })
        .on("mouseout", function(d) {
            $("#name").text("");
            $("#density").text("");
            $("#" + d.properties.COUNTYNAME).attr({opacity:1});
        });

        //map legend
        var legendw = 15,
            legendh = 200;

        var legendmap = svg.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr('x1', '0%') // bottom
        .attr('y1', '100%')
        .attr('x2', '0%') // to top
        .attr('y2', '0%')
        .attr("spreadMethod", "pad");

        var pct =d3.scale.log().domain([0.1,10]).range([0,100]);
        for(var i = 0; i <= 10;i++){
            legendmap.append("stop")
            .attr("offset",pct(i+0.1) +"%")
            .attr("stop-color", color(10000 * i/10+1))
            .attr("stop-opacity", 1);
        }

        svg.append("rect")
        .attr("width", legendw)
        .attr("height", legendh)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate("+width/6*5+","+height*3/5+")");

        var ykey = d3.scale.log()
        .range([0,legendh])
        .domain([10000,1]);

        var yAxisMap = d3.svg.axis()
        .scale(ykey)
        .orient("left")
        .tickValues([10,100,500,1000,2000,5000,10000])
        .tickFormat(d3.format("s"));

        svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+width/6*5+","+height*3/5+")")
        // .attr("transform", "rotate(-90)")
        .call(yAxisMap)
        .append("text")
        .attr("x", width-50)
        .attr("y", height/2-75)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("axis title");

    // Display International Airport Location
    d3.csv("src/airport.csv", function(error, data) {
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
            .attr("class", function(d){
                return ("mapCir mapCir_"+d.city);
            })
            .attr("cx", function(d) {
                    return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                    return projection([d.lon, d.lat])[1] - 20;
            })
            .attr("r", 8)
            .style("fill","#5f1854")
            .on("click",function(d,i){
                $(".airport_name_text").text(d.city);
                var imgfile;
                var description;
                if(d.code == "TPE")
                {
                    imgfile = "images/tpe.png"; 
                    description = "位於中華民國桃園市大園區的國際機場，為臺灣國際航空樞紐，由桃園國際機場公司經營。1979年2月26日啟用時名為「中正國際機場」，2006年10月改為現名。現今共有66家航空公司經營定期航線、飛往全球33個國家的143個航點，年均旅客流量超過4,000萬人次。";
                }
                if(d.code == "TSA"){
                    imgfile = "images/tsa.jpg"; 
                    description = "位於臺灣臺北市松山區的機場，啟用於1936年，為臺灣第一座機場，與桃園國際機場同為臺北的聯外機場。機場場區座落於臺北市中心的東北向，南連敦化北路終點、北接基隆河岸，並以民權東路及民族東路與市區相隔，總面積約2.13平方公里。";
                }
                if(d.code == "TXG"){
                    imgfile = "images/txg.jpg"; 
                    description = "為臺灣中部唯一的聯外機場，場區橫跨臺中市的沙鹿、清水、神岡、大雅等區，占地約1,800公頃[1]。該機場於日治時期開闢，在冷戰時期擴建至今日規模，曾是中華民國空軍和駐台美軍專用的軍用機場，之後因應臺中水湳機場的關閉而轉型為軍民合用機場，但場區仍由軍方管理。";
                }
                if(d.code == "KHH"){
                    imgfile = "images/khh.jpg"; 
                    description = "位於臺灣高雄市小港區的一座民用機場，因其所在位置，而又常被稱為小港國際機場或高雄小港機場，為南臺灣的主要聯外國際機場、以及國際客運出入吞吐地，也是臺灣第二大國際機場[1]。機場總面積為264.5公頃（1.021平方英里）。其管理及營運單位為中華民國交通部民用航空局高雄國際航空站。場區緊鄰高雄市區，亦是臺灣第一個設有聯外捷運系統的民用機場。高雄機場於2016年共服務了641萬6681旅客人次，2017年共服務了647萬9183旅客人次，位居全臺第二，次於桃園國際機場。";
                }
                //imageTooltip.attr('xlink:href', imgfile);
                d3.select(".airport_image")
                    .attr("src",imgfile)
                    .attr("height",150)
                    .attr("width",200);

                d3.select(".airport_description")
                    .text(description);

                //reset
                Array(0,0,0,0).forEach(function(h,j){
                    d3.select(".mapCir_"+data[j].city)
                    .attr("r",8);
                });
                d3.select(".mapCir_"+d.city)
                .attr("r",10);
            })
            .on("mouseover", function(d) {
                //console.log("here");
                d3.select(this)
                .style("cursor", "pointer"); 
            });
    });
});