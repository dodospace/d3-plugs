require('../style/xis.css')
var dataset = [{
    name: 'PC',
    color: 'black',
    sales: [
        { profit: 3000 },
        { profit: 1300 },
        { profit: 3700 },
        { profit: 4900 },
        { profit: 700 }
    ]
}, {
    name: 'SmartPhone',
    color: 'red',
    sales: [
        { profit: 2000 },
        { profit: 4000 },
        { profit: 1810 },
        { profit: 6540 },
        { profit: 2820 }
    ]
}, {
    name: 'Software',
    color: 'white',
    sales: [
        { profit: 1100 },
        { profit: 1700 },
        { profit: 1680 },
        { profit: 4200 },
        { profit: 4900 }
    ]
}, {
    name: 'Software',
    color: 'white',
    sales: [
        { profit: 1100 },
        { profit: 1700 },
        { profit: 1680 },
        { profit: 4200 },
        { profit: 4900 }
    ]
}];
var width = 1600;
var height = 400;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var stack = d3.layout.stack()
    .values(function(d) {
        return d.sales;
    })
    .x(function(d, i) {
        return d.year;
    })
    .y(function(d) {
        return d.profit;
    });

var data = stack(dataset);

var years = [2005, 2006, 2007, 2008, 2019];

var padding = { left: 50, right: 100, top: 30, bottom: 30 };

var xRangWidth = width - padding.left - padding.right;

var xScale = d3.scale
    .ordinal()
    .domain(years)
    .rangeBands([0, xRangWidth], 0.1);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

var maxProfit = d3.max(data[data.length - 1].sales, function(d) {
    return d.y0 + d.y
});

var yRangeWidth = height - padding.top - padding.bottom;


var yScale = d3.scale.linear()
    .domain([0, maxProfit])
    .range([0, yRangeWidth]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

var color = d3.scale.category10();

var groups = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('fill', function(d, i) {
        return color(i);
    })


var rects = groups.selectAll('rect')
    .data(function(d) {
        return d.sales;
    })
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
        return 100;
    })
    .attr('y', function(d) {
        return yRangeWidth - yScale(d.y0 + d.y);
    })
    .attr('width', function(d) {
        return xScale.rangeBand();
    })
    .attr('height', function(d) {
        return yScale(d.y);
    })

.transition()
    .duration(400)
    .attr('x', function(d, i) {
        return xScale(years[i]);
    })

// groups.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')scale(1,1)')
groups.attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')scale(1, 0)')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')scale(1,1)')

// var labHeight = 50;
// var labRadius = 10;

// var labelCircle = groups.append('circle')
//     .attr('cx', function(d) {
//         return width - padding.right * 0.98;
//     })
//     .attr('cy', function(d, i) {
//         return padding.top * 2 + labHeight * i;
//     })
//     .attr('r', labRadius);

// var labelText = groups.append('text')
//     .attr('x', function(d) {
//         return width - padding.right * 0.8;
//     })
//     .attr('y', function(d, i) {
//         return padding.top * 2 + labHeight * i;
//     })
//     .attr('dy', labRadius / 2)
//     .text(function(d) {
//         return d.name;
//     })

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
    .call(xAxis);

yScale.range([yRangeWidth, 0]);

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom - yRangeWidth) + ')')
    .call(yAxis);