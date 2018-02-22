document.addEventListener("DOMContentLoaded", function(event) {

    var data = [
        { year: 2012, passengers: 197, drivers: 475 },
        { year: 2013, passengers: 186, drivers: 474 },
        { year: 2014, passengers: 164, drivers: 426 },
        { year: 2015, passengers: 195, drivers: 511 },
        { year: 2016, passengers: 222, drivers: 506 }
    ];

    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var legendH = 30,
        title = 30;

    var svg = d3.select("#barsAndLines").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + legendH + title)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + (margin.top + title) + ")");
    var x = d3.scaleBand().range([0, width]).padding(0.3)
        .domain(data.map(function(d) { return d.year; }));
    var y = d3.scaleLinear().range([height, 0])
        .domain([0, d3.max(data, function(d) { return (d.passengers > d.drivers) ? d.passengers : d.drivers; })]);

    var valueline = d3.line()
        .x(function(d) { return x(d.year) + 30; })
        .y(function(d) { return y(d.drivers); });

    var bars = svg.selectAll("rect").data(data).enter().append("rect")
        .attr("x", function(d) { return x(d.year); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.passengers); })
        .attr("height", function(d) { return height - y(d.passengers); })
        .style('fill', "#007269");

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
        .attr("cx", function(d) { return x(d.year) + 30; })
        .attr("cy", function(d) { return y(d.drivers); })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("display", "block");
            div.html(d.drivers)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("display", "none");
        });

    bars.on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("display", "block");
            div.html(d.passengers);
        })
        .on("mousemove", function(d) {
            div.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("display", "none");
        });

    svg.append("rect").attr("width", 15).attr("height", 15).style("fill", "#007269")
        .attr("x", margin.left).attr("y", height + margin.top + title - 15);

    svg.append("circle").attr("r", 8).attr("cx", width / 2)
        .attr("cy", height + margin.top + title - 10).style("fill", "steelblue");

    svg.append("text").attr("x", margin.left + 16).attr("y", height + margin.top + title - 3)
        .style("font-size", "15px").text("Passengers");

    svg.append("text").attr("x", (width / 2) + 15).attr("y", height + margin.top + title - 5)
        .style("font-size", "15px").text("Drivers");

    svg.append("text").attr("x", (width / 2))
        .attr("y", 0 - margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Fatalities by Person Type");

})