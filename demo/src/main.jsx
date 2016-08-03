// import d3 from 'd3';
// require('./common/nest.js')  // nest 集合
// require('./common/bar.js') // 柱状图
// require('./common/point.js') // 散点图
// require('./common/scale.js') // 比例尺
// require('./common/xis.js') // 坐标轴
// require('./common/animation.js') // 动画
// require('./common/transition.js') // 过度动画
// require('./common/clock.js') // 时钟
// require('./common/ball.js') // 小球运动
// require('./common/keywords.js')  // 键盘事件
// require('./common/drag.js') // 拖拽事件
// require('./common/zoom.js') // 缩放事件

// require('./common/stack.js')
require('./style/uchart.css');
require('./style/xis.css')
import uStack from './uStack.js'
var dataset = [{
    name: 'PC',
    color: 'blue',
    data: [100, 200, 30, 50, 120, 100, 200, 30, 50, 120, 100, 200, 30, 50, 120]
}, {
    name: 'SmartPhone',
    color: 'red',
    data: [60, 220, 90, 150, 320, 60, 220, 90, 150, 320, 60, 220, 90, 150, 320]
}, {
    name: 'Software',
    color: 'orange',
    data: [300, 120, 20, 90, 80, 300, 120, 20, 90, 80, 300, 120, 20, 90, 80]
},
{
    name: 'Name',
    color: 'yellow',
    data: [312, 120, 20, 90, 80, 300, 120, 20, 90, 80, 300, 120, 20, 90, 80]
}];

var times = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];

var opts = {
    xAxis: {
        categories: times
    },
    style: {
        height: 300
        // width: 1000
    },
    series: dataset,
    tooltip: {
        formatter: function(value){
            var s = 'Gushaohua';
            console.log(this);
            return s;
        }
    },
    events: {
        // click: function (value, index) {
        //     // alert('Click Event')
        // }
    }
}
var myChart = new uStack('#container', opts);


// var arr = [1, 3, 5, 7, 9, 11, 13, 15];

// for (var i = 0; i < arr.length; i++) {
//     var x = arr[i];
//     for (var j = 0; j < arr.length; j++) {
//         var y = arr[j];
//         for (var k = 0; k < arr.length; k++) {
//             var z = arr[k];
//             if((x + y + z) == 31 ) {
//                 console.log(x + '+' + y + '+' + z + '= 31');
//             } else {
//                 // console.log('error');
//             }
//         }
//     }
// }

// import uChart from './uyun.js';
// require('./style/uchart.css');

// var opts = {
//     pageIndex: 1,
//     // style: {
//     //     // padding: '20 20 20 20',
//     //     // width: 400,
//     //     // height: 8
//     // },
//     series: {
//         data: [0 , 0, 3, 3, 1, 1, 1, 3, 2,1 ,2 , 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1],
//         color: {
//             domain: [0 , 3],
//             range: ['#ed3f1d', '#ffef3f', '#9ea0b6', '#48c644']
//         }
//     },
//     events: {
//         // click: function (value, index) {
//         //     // alert('Click Event')
//         // }
//     }
// }

// var myChart = new uChart('#container', opts);




// var width  = 400;
// var height = 400;
// var svg = d3.select('body')
//             .append('svg')
//             .attr('width', width)
//             .attr('height', height);
// svg.append('circle')
//    .attr('cx', '50px')
//    .attr('cy', '50px')
//    .attr('r', '50px')
//    .attr('fill', 'red');

// var p = d3.selectAll('p');
// console.log(p.empty());
// console.log(p.node());
// console.log(p.size());

// console.log(p.classed('active'),true);

// var p = d3.selectAll('p');
// p.datum('Gushaohua')
//         .text(function (d, i) {
//             return d + '' + i
//         });

// p.datum('Gushaohua')
//         .append('span')
//         .text(function (d, i) {
//             return ' ' + d;
//         })

// var dataset = [3, 6];
// var update = p.data(dataset);
// console.log(update);
// console.log(update.enter());
// console.log(update.exit());

// var persons = [
//     {id: 3, name: '张三'},
//     {id: 6, name: '李四'},
//     {id: 9, name: '王五'}
// ];
// var p = d3.select('body').selectAll('p');
// p.data(persons)
//     .text(function (d) {
//         return d.id + ' : ' + d.name
//     });

// persons = [
//     {id: 6, name: '张三'},
//     {id: 9, name: '李四'},
//     {id: 3, name: '王五'}
// ];
// p.data(persons, function (d) {
//     return d.id
// }).text(function (d) {
//     return d.id + ' : ' + d.name
// })

// var dataset = [3, 6, 9];
// var p = d3.select('body').selectAll('p');
// var update = p.data(dataset);
// var enter = update.enter();
// update.text(function (d) {
//     return d;
// });
// enter.append('p')
//      .text(function (d) { return d; });

// var dataset = [10, 20, 30, 40, 50];
// var p = d3.select('body').selectAll('p');
// p.data(dataset)
//  .enter()
//  .append('p')
//  .text(function (d, i) {
//      return i + ': ' + d;
//  });

// var dataset = [10, 20, 30];
// var p = d3.select('body').selectAll('p');
// p.data(dataset)
//  .text(function (d) {
//      return d;
//  })
//  .exit()
//  .remove()

// var numbers = [30, 40, 10, 20, 50];
// var min = d3.min(numbers);
// var max = d3.max(numbers);
// var extent = d3.extent(numbers);
// var sum = d3.sum(numbers);
// var mean = d3.mean(numbers);

// console.log(min);
// console.log(max);
// console.log(extent);
// console.log(sum);
// console.log(mean);

// var minAcc = d3.min(numbers, function (d){ return 'This is minAcc!' + d * 3 });
// var maxAcc = d3.max(numbers, function (d){ return 'This is maxAcc!' + d * 2 });
// var extentAcc = d3.extent(numbers, function (d){ return 'This is extentAcc!' + d % 7 });

// console.log(minAcc);
// console.log(maxAcc);
// console.log(extentAcc);

// var colors = ['red', 'blue', 'green', 'yellow'];
// var pairs = d3.pairs(colors);

// console.log(pairs);

// var a = d3.range(10);
// console.log(a);

// var b = d3.range(4, 20);
// console.log(b);

// var c = d3.range(3, 30, 4);
// console.log(c);

// var data = ['One', 'Two', 'Three'];
// var newData = d3.permute(data, [0, 0, 1, 2, 2]);
// console.log(data);
// console.log(newData);

// var data1 = [1, 2, 3],
//     data2 = ['red', 'yellow', 'blue'],
//     data3 = [true, false, undefined];
// var newData = d3.zip(data1, data2, data3);

// var dataset = [
//     {id: 1001, color: 'red'},
//     {id: 1002, color: 'blue'},
//     {id: 1003, color: 'yellow'}
// ];

// var map = d3.map(dataset,function (d, i) {
//     return d.id;
// });

// console.log(map.has(1001));
// console.log(map.has(1004));

// console.log(map.get(1002));
// console.log(map.get(1005));

// console.log(map.set(1001, {name: 'Gushaohua'}));

// map.remove(1001);
// console.log(map);

// console.log(map.keys());
// console.log(map.values());
// console.log(map.entries());

// map.forEach(function (key, value) {
//     console.log(key);
//     console.log(value);
// })

// console.log(map.empty());
// console.log(map.size());

// var dataset = ['red', 'green', 'blue', 'write', 'yellow'];

// var set = d3.set(dataset);

// console.log(set.has('blue'));
// console.log(set.add('black'));
// console.log(set.remove('red'));

// console.log(set.values());

// set.forEach(function (value) {
//     console.log(value);
// });

// console.log(set.empty());
// console.log(set.size());
// console.log(set);