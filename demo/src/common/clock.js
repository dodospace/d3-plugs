require('../style/time.css')
var svg = d3.select('body').append('svg')
    .attr('width', 600)
    .attr('height', 600);

function getTimeString() {
    var time = new Date();

    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
}

var timeText = svg.append('text')
    .attr('x', 100)
    .attr('y', 100)
    .attr('class', 'time')
    .text(getTimeString());

setInterval(function() {
    timeText.text(getTimeString());
}, 1000);