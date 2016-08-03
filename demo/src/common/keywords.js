// var characters = ['A', 'S', 'D', 'F'];

// var svg = d3.select('body').append('svg')
//     .attr('width', 600)
//     .attr('height', 600);

// var rects = svg.selectAll('rect')
//     .data(characters)
//     .enter()
//     .append('rect')
//     .attr('x', function(d, i) {
//         return 10 + i * 60;
//     })
//     .attr('y', 150)
//     .attr('width', 55)
//     .attr('height', 55)
//     .attr('rx', 5)
//     .attr('ry', 6)
//     .attr('fill', 'black');

// var text = svg.selectAll('text')
//     .data(characters)
//     .enter()
//     .append('text')
//     .attr('x', function(d, i) {
//         return 10 + i * 60;
//     })
//     .attr('y', 150)
//     .attr('dx', 10)
//     .attr('dy', 25)
//     .attr('fill', 'white')
//     .attr('font-size', '24')
//     .text(function(d) {
//         return d;
//     })

// d3.select('body')
//     .on('keydown', function() {
//         rects.attr('fill', function(d) {
//             if (d == String.fromCharCode(d3.event.keyCode)) {
//                 return 'yellow';
//             } else {
//                 return 'black';
//             }
//         })
//     })
//     .on('keyup', function() {
//         rects.attr('fiall', 'black')
//     });

var svg = d3.select('body')
    .append('svg')
    .attr('width', 400)
    .attr('height', 400)
    .style('background', 'yellow');

svg.append('rect')
    .attr('x', 200)
    .attr('y', 100)
    .attr('width', 100)
    .attr('height', 100)
    .on('click', function() {
        console.log(d3.mouse(this));
    })