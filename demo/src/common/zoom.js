var svg = d3.select('body').append('svg')
    .attr('width', 600)
    .attr('height', 600);

var circles = [{
    cx: 150,
    cy: 200,
    r: 30
}, {
    cx: 220,
    cy: 200,
    r: 30
}, {
    cx: 150,
    cy: 270,
    r: 30
}, {
    cx: 220,
    cy: 270,
    r: 30
}];

var x = d3.scale.linear()
    .domain([0, 600])
    .range([0, 600]);

var y = d3.scale.linear()
    .domain([0, 600])
    .range([0, 600]);

var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 10])
    .on('zoom', function(d) {
        console.log('x 的定义域： ' + x.domain());
        console.log('x 的值域： ' + x.range());
        console.log('y 的定义域： ' + y.domain());
        console.log('y 的值域： ' + y.range());

        d3.select(this).attr('transform',
            'translate(' + d3.event.translate + ')' +
            'scale(' + d3.event.scale + ')'
        );
    });

var g = svg.append('g')
    .call(zoom);

g.selectAll('circle')
    .data(circles)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
        return d.cx;
    })
    .attr('cy', function(d) {
        return d.cy;
    })
    .attr('r', function(d) {
        return d.r;
    })
    .attr('fill', 'steelblue');