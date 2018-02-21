document.addEventListener("DOMContentLoaded", function() {
    var data = [
        { year: '2007', value: 8000 },
        { year: '2008', value: 6900 },
        { year: '2009', value: 6000 },
        { year: '2010', value: 5500 },
        { year: '2011', value: 5600 },
        { year: '2012', value: 5400 },
        { year: '2013', value: 5200 },
        { year: '2014', value: 5000 },
        { year: '2015', value: 5100 },
        { year: '2016', value: 5000 }
    ];

    var container = d3.select("#chart");

    var margin = { top: 20, right: 20, bottom: 10, left: 50 },
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    var title = 20;

    var max = data.reduce((a, b) => (a.value > b.value) ? a.value : b.value);
    var scale = d3.scaleLinear().domain([0, max]).range([0, height - title]);
    var x = d3.scaleBand()
        .range([0, width - 10])
        .padding(0.2); //2/10 of the width of the bar (distance between bars)
    var y = d3.scaleLinear()
        .range([height - title, 0]);

    x.domain(data.map(function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    var svg = container.append("svg").style('background', '#dff0d8');
    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + title)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    svg.selectAll("rect").data(data).enter().append("rect")
        .attr("x", function(d) { return x(d.year) + 60; })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value) + (title * 2); })
        .attr("height", function(d) { return height - y(d.value) - title; })
        .style('fill', "#007269");

    svg.append("g")
        .attr("transform", "translate(60," + (height + title) + ")")
        .call(d3.axisBottom(x))
        .style("text-anchor", "middle")

    svg.append("g")
        .attr("transform", "translate(60," + (title + margin.top) + ")")
        .call(d3.axisLeft(y).ticks(7));

    svg.append("text").attr("x", (width / 2) + margin.left)
        .attr("y", ((title + margin.top) / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Alcohol Related Crashes");
})