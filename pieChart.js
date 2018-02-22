document.addEventListener("DOMContentLoaded", function() {

    var data = [
        { damage: "Fatality", cost: 1530000 },
        { damage: "Incapacitating Injury", cost: 76398 },
        { damage: "Non-Incapacitating Injury", cost: 24480 },
        { damage: "Possible Injury", cost: 13872 },
        { damage: "Property Damage Only", cost: 9486 }
    ];
    var colors = [
        "#92b5bf", "#00515c", "#007269", "#00a588", "rgb(84, 85, 110)",
        "#92f1bf", "#64515c"
    ];

    var margin = { top: 30, right: 20, bottom: 10, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom,
        radius = Math.min(width, height) / 2;

    var svg = d3.select("#pie").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +
            ',' + (((height + margin.top) / 2)) + ')');

    var arc = d3.arc().outerRadius(radius - 10).innerRadius(70)
        .padAngle(0.01);

    var pie = d3.pie().sort(null).value(function(d) { return d.cost; });

    var tooltip = d3.select("#pie").append("div")
        .attr("class", "tooltip");

    tooltip.append('div')
        .attr('class', 'label');

    tooltip.append('div')
        .attr('class', 'count');

    tooltip.append('div')
        .attr('class', 'percent');

    var path = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
            return colors[i];
        });

    path.on('mouseover', function(d) {
        var total = d3.sum(data.map(function(d) {
            return d.cost;
        }));
        var percent = Math.round(1000 * (d.data.cost / total)) / 10;
        tooltip.select('.label').html(d.data.damage);
        tooltip.select('.count').html("$" + d.data.cost);
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('display', 'inline');
    });

    path.on("mousemove", function(d) {
        tooltip.style("left", (d3.event.clientX - 50) + "px").style("top", (d3.event.clientY - 20) + "px");
    })
    path.on('mouseout', function() {
        tooltip.style('display', 'none');
    });

    svg.append("text").style("text-anchor", "middle")
        .style("position", "absolute")
        .style("left", (width / 2))
        .attr("y", 0 - (height / 2))
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Average Economic Cost per Incident ");


})