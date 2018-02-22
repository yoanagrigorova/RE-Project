document.addEventListener("DOMContentLoaded", function(event) {

    var data = [
        { year: 2011, us: 1.10, az: 1.39 },
        { year: 2012, us: 1.14, az: 1.37 },
        { year: 2013, us: 1.10, az: 1.40 },
        { year: 2014, us: 1.08, az: 1.24 },
        { year: 2015, us: 1.12, az: 1.38 }
    ];

    var legendHeight = 50;
    var margin = { top: 40, right: 20, bottom: 30, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scaleTime().range([10, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var parseTime = d3.timeParse("%Y");

    var valueline1 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.us); });

    var valueline2 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.az); });


    var svg = d3.select("#multiline").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + legendHeight)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        d.year = parseTime(d.year);
        d.us = +d.us;
        d.az = +d.az;
    });

    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([1, 1.5]);

    var path1 = svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "blue")
        .attr("d", valueline1);

    var path2 = svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline2);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y).ticks(3));

    var div1 = d3.select("body").append("div")
        .attr("class", "tooltip1")
        .style("display", "none");
    var div2 = d3.select("body").append("div")
        .attr("class", "tooltip1")
        .style("display", "none");

    svg.append("text").attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Arizona vs. U.S. Fatality Rate");

    svg.append("text").attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Rate Per 100 Milion Miles");

    svg.append("circle").attr("cx", margin.left)
        .attr("cy", height + margin.top + 5).style("fill", "red")
        .attr("r", 8);

    svg.append("circle").attr("cx", width / 2)
        .attr("cy", height + margin.top + 5).style("fill", "blue")
        .attr("r", 8);

    svg.append("text").attr("x", margin.left + 12).attr("y", height + margin.top + 10)
        .style("font-size", "15px").text("Arizona Fatality Rate");
    svg.append("text").attr("x", (width / 2) + 12).attr("y", height + margin.top + 10)
        .style("font-size", "15px").text("U.S Fatality Rate");

    var az = new Array(data.length);
    var us = new Array(data.length);
    data.forEach(function(d, i) {
        az[i] = d.az;
        us[i] = d.us;
    });

    createDots(data, div1, us, "blue");
    createDots(data, div2, az, "red");

    function createDots(data, div, yArr, color) {
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", color)
            .attr("cx", function(d) { return x(d.year); })
            .attr("cy", function(d, i) { return y(yArr[i]); })
            .on("mouseover", function(d, i) {
                div.transition()
                    .duration(200)
                    .style("display", "inline");
                div.html(yArr[i])
                    .style("left", (d3.event.pageX - 15) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("display", "none");
            });
    }

})