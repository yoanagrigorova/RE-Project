document.addEventListener("DOMContentLoaded", function() {

    var data = [
        { year: 2011, value: 132 },
        { year: 2012, value: 139 },
        { year: 2013, value: 149 },
        { year: 2014, value: 128 },
        { year: 2015, value: 134 }
    ];

    var margin = { top: 50, right: 20, bottom: 30, left: 50 },
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        padding = 10;

    var parseTime = d3.timeParse("%Y");

    var x = d3.scaleTime().range([padding, width - padding * 2]);
    var y = d3.scaleLinear().range([height, 0]);

    var valueline = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.value); });

    var svg = d3.select("#line").append("svg")
        .style('background', '#dff0d8')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        d.year = parseTime(d.year);
        d.value = +d.value;
    });

    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([d3.min(data, function(d) { return d.value; }) - 3, d3.max(data, function(d) { return d.value; })]);

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));

    svg.append("g")
        .call(d3.axisLeft(y).ticks(5));

    var div = d3.select("body").append("div")
        .attr("class", "tooltip1")
        .style("display", "none");

    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .style("fill", "steelblue")
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.value); })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("display", "block");
            div.html(d.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("display", "none");
        });


    svg.append("text").attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("MC Fatalities by Year");
})