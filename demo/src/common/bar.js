require('../style/xis.css')

var dataset = [50, 43, 120, 98, 99, 167, 142];
var width = 400;
var height = 400;

var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

var padding = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
};

var xAxisWidth = 300;
var yAxisWidth = 300;

var xScale = d3.scale.ordinal()
    .domain(d3.range(dataset.length))
    .rangeRoundBands([0, xAxisWidth], 0.2);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset)])
    .range([0, yAxisWidth]);

var color = d3.scale.category10();

var rect = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('fill', function(d) {
        return color(d);
    })
    .attr('x', function(d, i) {
        return padding.left + xScale(i);
    })
    .attr('y', function(d) {
        return height - padding.bottom - yScale(d);
    })
    .attr('width', xScale.rangeBand())
    .attr('height', function(d) {
        return yScale(d);
    })
    .on('mouseover', function(d, i) {
        d3.select(this)
            .attr('fill', '#999')
    })
    .on('mouseout', function(d, i) {
        d3.select(this)
            .transition()
            .duration(500)
            .attr('fill', color(d));
    });

var text = svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .attr('fill', 'white')
    .attr('font-size', '14px')
    .attr('text-anchor', 'middle')
    .attr('x', function(d, i) {
        return padding.left + xScale(i);
    })
    .attr('y', function(d) {
        return height - padding.bottom - yScale(d);
    })
    .attr('dx', xScale.rangeBand() / 2)
    .attr('dy', '1em')
    .text(function(d) {
        return d;
    });

function draw() {
    var updateRect = svg.selectAll('rect').data(dataset);
    var enterRect = updateRect.enter();
    var exitRect = updateRect.exit();

    var updateText = svg.selectAll('text').data(dataset);
    var enterText = updateText.enter();
    var exitText = updateText.exit();

    updateRect.attr('fill', 'steelblue')
        .attr('x', function(d, i) {
            return padding.left + xScale(i);
        })
        .attr('y', function(d) {
            return height - padding.bottom - yScale(d);
        })
        .attr('width', xScale.rangeBand())
        .attr('height', function(d) {
            return yScale(d);
        });

    enterRect.append('rect')
        .attr('fill', 'steelblue')
        .attr('x', function(d, i) {
            return padding.left + xScale(i);
        })
        .attr('y', function(d) {
            return height - padding.bottom - yScale(d);
        })
        .attr('width', xScale.rangeBand())
        .attr('height', function(d) {
            return yScale(d);
        });

    exitRect.remove();

    updateText.attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .attr('x', function(d, i) {
            return padding.left + i * xScale(i);
        })
        .attr('y', function(d) {
            return height - padding.bottom - yScale(d);
        })
        .attr('dx', xScale.rangeBand() / 2)
        .attr('dy', '1em')
        .text(function(d) {
            return d;
        });

    enterText.append('text')
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .attr('x', function(d, i) {
            return padding.left + i * xScale(i);
        })
        .attr('y', function(d) {
            return height - padding.bottom - yScale(d);
        })
        .attr('dx', xScale.rangeBand() / 2)
        .attr('dy', '1em')
        .text(function(d) {
            return d;
        });

    exitText.remove();
}

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

// var btn1 = document.getElementById('btn1');
// var btn2 = document.getElementById('btn2');
// btn1.addEventListener('click', function() {
//     dataset.sort(d3.ascending);
//     draw();
// });

// btn2.addEventListener('click', function() {
//     dataset.push(Math.floor(Math.random() * 100));
//     draw();
// });