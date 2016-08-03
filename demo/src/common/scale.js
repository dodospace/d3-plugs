// var linear = d3.scale.linear()
//     .domain([0, 40])
//     .range([0, 100]);
// console.log(linear(10));
// console.log(linear(50));

// console.log(linear.invert(40));

// linear.clamp(true);
// console.log(linear(50));

// linear.rangeRound([0, 100]);
// console.log(linear(13.33));

// linear.domain([0.000000321231, 0.3999999999]).nice();
// console.log(linear.domain());

// var linear = d3.scale.linear()
//     .domain([-20, 20])
//     .range([0, 100]);

// var ticks = linear.ticks(5);
// console.log(ticks);

// var tickFormat = linear.tickFormat(5, '+');

// for (var i = 0; i < ticks.length; i++) {
//     ticks[i] = tickFormat(ticks[i]);
// }
// console.log(ticks);

/* ========================  线性比例尺 END ======================== */

// var pow = d3.scale.pow().exponent(3);
// console.log(pow(2));
// console.log(pow(3));

// pow.exponent(0.5);
// console.log(pow(2));
// console.log(pow(3));

// var pow = d3.scale.pow()
//     .exponent(3)
//     .domain([0, 3])
//     .range([0, 90]);
// console.log(pow(1.5)); // 11.25

// var pow = d3.scale.pow()
//     .exponent(3)
//     .domain([0, 3])
//     .range([0, 90]);

// var linear = d3.scale.pow()
//     .domain([0, Math.pow(3, 3)])
//     .range([0, 90]);

// console.log(pow(1.5));
// console.log(linear(Math.pow(1.5, 3)));

/* ========================  指数比例尺 END ======================== */

// var quantize = d3.scale.quantize()
//         .domain([0, 10])
//         .range(['red', 'grenn', 'yellow', 'blue', 'pink']);

// console.log(quantize(1));
// console.log(quantize(3));
// console.log(quantize(5.9999));
// console.log(quantize(6));

// var quantize = d3.scale.quantize()
//     .domain([50, 0])
//     .range(['#888', '#666', '#444', '#222', '#000']);

// var r = [45, 35, 25, 15, 5]

// var svg = d3.select('body').append('svg')
//     .attr('width', 400)
//     .attr('height', 400);

// svg.selectAll('circle')
//     .data(r)
//     .enter()
//     .append('circle')
//     .attr('cx', function (d, i) { return 50 + i * 30 })
//     .attr('cy', 50)
//     .attr('r', function(d) { return d; })
//     .attr('fill', function(d) { return quantize(d)});

// var quantize = d3.scale.quantize()
//     .domain([0, 2, 4, 10])
//     .range([1, 100]);

// var quantile = d3.scale.quantile()
//     .domain([0, 2, 4, 10])
//     .range([1, 100]);

// console.log(quantize(5));
// console.log(quantile(3));
// console.log(quantile.quantiles());

/* ========================  量子/分位 比例尺 END ======================== */

// var threshold = d3.scale.threshold()
//     .domain([10, 20, 30])
//     .range(['red', 'green', 'blue', 'black']);

// console.log(threshold(5));
// console.log(threshold(15));
// console.log(threshold(25));
// console.log(threshold(35));

// console.log(threshold.invertExtent('red'));
// console.log(threshold.invertExtent('green'));
// console.log(threshold.invertExtent('blue'));
// console.log(threshold.invertExtent('black'));

/* ========================  阙值比例尺 END ======================== */

// var ordinal = d3.scale.ordinal()
//     .domain([1, 2, 3, 4, 5])
//     .range([10, 20, 30, 40, 50]);

// console.log(ordinal.range());
// console.log(ordinal(1));
// console.log(ordinal(3));
// console.log(ordinal(5));

// ordinal.rangePoints([0, 100], 5);
// console.log(ordinal.range());

// ordinal.rangeRoundPoints([0,100], 5);
// console.log(ordinal.range());

// var bands = d3.scale.ordinal()
//     .domain([1, 2, 3, 4, 5])
//     .rangeBands([0, 100]);

// console.log(bands.range());
// console.log(bands.rangeBand());

// bands.rangeBands([0, 100], 0.5, 0.2);
// console.log(bands.range());
// console.log(bands.rangeBand());

// var color = d3.scale.category10();
// console.log(color(1));
// console.log(color('zhangsan'));

var width = 600;
var height = 600;
var dataset = d3.range(7);

var color = d3.scale.category10();

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var circle = svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', function(d, i) {
        return 30 + i * 80;
    })
    .attr('cy', 100)
    .attr('r', 30)
    .attr('fill', function(d, i) {
        return color(i);
    });

/* ========================  序数比例尺 END ======================== */