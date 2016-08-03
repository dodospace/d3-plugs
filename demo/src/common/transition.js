require('../style/xis.css');
var center = [
    [0.5, 0.5],
    [0.7, 0.8],
    [0.4, 0.9],
    [0.11, 0.32],
    [0.88, 0.25],
    [0.75, 0.12],
    [0.5, 0.1],
    [0.2, 0.3],
    [0.4, 0.1],
    [0.6, 0.7]
];

var width = 500;
var height = 500;

var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

var padding = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

var xAxisWidth = 300;
var yAxisWidth = 300;

var xScale = d3.scale.linear()
    .domain([0, 1])
    .range([0, xAxisWidth]);

var yScale = d3.scale.linear()
    .domain([0, 1])
    .range([0, yAxisWidth]);

function drawCircle() {
    var circleUpdate = svg.selectAll('circle')
        .data(center);

    var circleEnter = circleUpdate.enter();

    var circleExit = circleUpdate.exit();

    var color = d3.scale.category20();

    circleUpdate.transition()
        .attr('fill', function(d) {
            return color(d);
        })
        .duration(500)
        .attr('cx', function(d) {
            return padding.left + xScale(d[0]);
        })
        .attr('cy', function(d) {
            return height - padding.bottom - yScale(d[0]);
        });

    circleEnter.append('circle')
        .attr('fill', function(d) {
            return color(d);
        })
        .attr('cx', padding.left)
        .attr('cy', height - padding.bottom)
        .attr('r', 7)
        .transition()
        .duration(500)
        .attr('cx', function(d) {
            return padding.left + xScale(d[0]);
        })
        .attr('cy', function(d) {
            return height - padding.bottom - yScale(d[1]);
        });

    circleExit.transition()
        .duration(500)
        .attr('fill', 'white')
        .remove();
}

function drawAxis() {
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5);

    yScale.range([yAxisWidth, 0]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(5);

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom - yAxisWidth) + ')')
        .call(yAxis);

    yScale.range([0, yAxisWidth]);
}

var update = document.getElementById('update');
var add = document.getElementById('add');
var sub = document.getElementById('sub');

update.addEventListener('click', function() {
    for (var i = 0; i < center.length; i++) {
        center[i][0] = Math.random();
        center[i][1] = Math.random();
    }
    console.log(center);
    drawCircle();
    drawAxis();
});

add.addEventListener('click', function() {
    center.push([Math.random(), Math.random()]);
    drawCircle();
    drawAxis();
})

sub.addEventListener('click', function() {
    center.pop();
    drawCircle();
    drawAxis();
})