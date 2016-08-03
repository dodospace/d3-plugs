require('../style/xis.css')
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

var xAxisWidth = 300;
var yAxisWidth = 300;
var width = 400;
var height = 400;

var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);


var xScale = d3.scale.linear()
    .domain([0, 1.2 * d3.max(center, function(d) {
        return d[0];
    })])
    .range([0, xAxisWidth]);

var yScale = d3.scale.linear()
    .domain([0, 1.2 * d3.max(center, function(d) {
        return d[1];
    })])
    .range([0, xAxisWidth]);

var color = d3.scale.category10();
var padding = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};


var circle = svg.selectAll('circle')
    .data(center)
    .enter()
    .append('circle')
    .attr('fill', function(d) {
        return color(d);
    })
    .attr('cx', function(d) {
        return padding.left + xScale(d[0]);
    })
    .attr('cy', function(d) {
        return height - padding.bottom - yScale(d[1])
    })
    .attr('r', 5);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

yScale.range([yAxisWidth, 0]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
    .call(xAxis);

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom - yAxisWidth) + ')')
    .call(yAxis);