require('../style/xis.css')
var svg = d3.select('body').append('svg')
    .attr('width', 800)
    .attr('height', 800);

// svg.append('rect')
//     .attr('fill', 'steelblue')
//     .attr('x', 10)
//     .attr('y', 10)
//     .attr('width', 100)
//     .attr('height', 30)
//     .transition()
//     .attr('width', 300);

// var rect = svg.append('rect')
//     .attr('fill', 'steelblue')
//     .attr('x', 10)
//     .attr('y', 10)
//     .attr('width', 100)
//     .attr('height', 30);

// var rectTran = rect.transition()
//     .delay(500)
//     .duration(1000)
//     .ease('bounce')
//     .attr('width', 300);

// var rectTran = rect.transition()
//     .attr('width', 300)
//     .transition()
//     .attr('height', 300)
//     .transition()
//     .attr('width', 100)
//     .transition()
//     .attr('height', 100); 

// var rectTran = rect.transition()
//     .duration(2000)
//     .attrTween('width', function(d, i, a) {
//         return function(t) {
//             return Number(a) + t * 300;
//         }
//     });

// var text = svg.append('text')
//     .attr('fill', 'red')
//     .attr('x', 100)
//     .attr('y', 10)
//     .attr('dy', '1.2em')
//     .attr('text-anchor', 'end')
//     .text(100);

// var initx = text.attr('x');
// var initText = text.text();

// var textTran = text.transition()
//     .duration(2000)
//     .tween('text', function() {
//         return function(t) {
//             d3.select(this)
//                 .attr('x', Number(initx) + t * 300)
//                 .text(Math.floor(Number(initText) + t * 300));
//         }
//     });


// var dataset = [100, 100, 100];

// var g = svg.append('g');

// var rect = g.selectAll('rect')
//     .data(dataset)
//     .enter()
//     .append('rect')
//     .attr('transform', 'translate(0,0)')
//     .attr('fill', 'steelblue')
//     .attr('id', function(d, i) {
//         return 'rect' + i;
//     })
//     .attr('x', 10)
//     .attr('y', function(d, i) {
//         return 10 + i * 35;
//     })
//     .attr('width', function(d, i) {
//         return d;
//     })
//     .attr('height', 30);

// g.transition()
//     .select('#rect1')
//     .attr('width', 300);

// g.transition()
//     .selectAll('rect')
//     .attr('width', 300);

// g.transition()
//     .duration(2000)
//     .attr('transform', 'translate(400,0)');

// g.transition()
//     .duration(2000)
//     .selectAll('rect')
//     .each('start', function(d, i) {
//         console.log('start');
//     })
//     .each('end', function(d, i) {
//         console.log('end');
//     })
//     .attr('width', 300);

// g.transition()
//     .duration(2000)
//     .selectAll('rect')
//     .each('interrupt', function (d, i) {
//         console.log('interrupt');
//     })
//     .attr('width', 300);

// setTimeout(function () {
//     g.transition()
//         .selectAll('rect')
//         .attr('width', 10);
// },1000);

// var xScale = d3.scale.linear()
//     .domain([0, 10])
//     .range([0, 300]);

// var xAxis = d3.svg.axis()
//     .scale(xScale)
//     .orient('bottom');

// var g = svg.append('g')
//     .attr('class', 'axis')
//     .attr('transform', 'translate(80, 100)')
//     .call(xAxis);

// xScale.domain([0, 50]);

// g.transition()
//     .duration(2000)
//     .call(xAxis);