var svg = d3.select('body').append('svg')
    .attr('width', 600)
    .attr('height', 600);

var circles = [{
    cx: 150,
    cy: 200,
    r: 30
}, {
    cx: 250,
    cy: 200,
    r: 30
}]

var drag = d3.behavior.drag()
    .origin(function(d, i) {
        return {
            x: d.cx,
            y: d.cy
        }
    })
    .on('dragstart', function(d) {
        console.log('拖拽开始');
    })
    .on('dragend', function(d) {
        console.log('拖拽结束');
    })
    .on('drag', function(d) {
        d3.select(this)
            .attr('cx', d.cx = d3.event.x)
            .attr('cy', d.cy = d3.event.y);
    })

svg.selectAll('circle')
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
    .attr('fill', 'black')
    .call(drag);