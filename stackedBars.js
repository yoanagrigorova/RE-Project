document.addEventListener("DOMContentLoaded", function(event) {

    var data = [
        { year: 2012, urban: 394, rural: 427 },
        { year: 2013, urban: 442, rural: 407 },
        { year: 2014, urban: 395, rural: 379 },
        { year: 2015, urban: 468, rural: 429 },
        { year: 2016, urban: 518, rural: 434 }
    ];

    var colors = ["#64515c", "#00a588"];
    var stack = d3.stack()
        .keys(["urban", "rural"])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var series = stack(data);
    var margin = { top: 20, right: 20, bottom: 10, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        legendSpace = 50,
        title = 20;;

    var svg = d3.select("#stackedBars").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + legendSpace + title)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        d.total = d.urban + d.rural;
    });

    var translateY = 10;
    var x = d3.scaleBand().range([0, width]).padding(0.2)
        .domain(data.map(function(d) { return d.year; }));
    var y = d3.scaleLinear().range([height, 0])
        .domain([0, d3.max(data, function(d) { return d.total; })]);

    var bars = svg.selectAll("g").data(series).enter().append("g").style("fill", function(d, i) { return colors[i] })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return x(d.data.year); })
        .attr("y", function(d) { return y(d[1]) - translateY + (title * 2); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    var div = d3.select("body").append("div")
        .attr("class", "tooltip1")
        .style("display", "none");
    bars.on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("display", "inline");
            div.html(d[1] - d[0]);
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
    svg.append("g")
        .attr("transform", "translate(10," + (height + margin.bottom + title) + ")")
        .call(d3.axisBottom(x))
        .style("text-anchor", "middle");

    svg.append("g")
        .attr("transform", "translate(0," + (translateY + title) + ")")
        .call(d3.axisLeft(y));

    svg.append("rect").style("fill", colors[0]).attr("width", 15).attr("height", 15)
        .attr("x", margin.left).attr("y", height + margin.top + title * 2);

    svg.append("text").attr("x", margin.left + 15).attr("y", height + margin.top + margin.bottom + title * 2)
        .style("font-size", "15px").text("Urban Fatalities");

    svg.append("rect").style("fill", colors[1]).attr("width", 15).attr("height", 15)
        .attr("x", width / 2).attr("y", height + margin.top + title * 2);

    svg.append("text").attr("x", (width / 2) + 15).attr("y", height + margin.top + margin.bottom + title * 2)
        .style("font-size", "15px").text("Rural Fatalities");

    svg.append("text").attr("x", (width / 2))
        .attr("y", (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Traffic Fatalities by Geographic Region");

})