window.$ = require('jquery');
require('./Format.js');
require('./style/uchart.css');
require('./style/xis.css')
import uStack from './uStack.js'


var dataset = [{
    name: '错误事件数',
    color: '#ed3f1d',
    data: [0, 200, 30, 50, 120, 100, 200, 30, 50, 120, 100, 200, 30, 50, 120]
}, {
    name: '警告事件数',
    color: '#ffef3f',
    data: [60, 220, 90, 150, 320, 60, 220, 90, 150, 320, 60, 220, 90, 150, 320]
}, {
    name: '提醒事件数',
    color: '#9ea0b6',
    data: [300, 120, 20, 90, 80, 300, 120, 20, 90, 80, 300, 120, 20, 90, 80]
},
{
    name: '正常事件数',
    color: '#48c644',
    data: [312, 120, 20, 90, 80, 300, 120, 20, 90, 80, 300, 120, 20, 90, 80]
}];

var newData = [{
    name: '错误事件数',
    color: '#ed3f1d',
    data: [312, 120, 20, 90, 80, 300, 120, 20, 90, 80, 300, 120, 20, 90, 80]
}, {
    name: '警告事件数',
    color: '#ffef3f',
    data: [0, 200, 30, 50, 120, 100, 200, 30, 50, 120, 100, 200, 30, 50, 120]
}, {
    name: '提醒事件数',
    color: '#9ea0b6',
    data: [312, 120, 20, 90, 80, 300, 120, 20, 90, 80, 300, 120, 20, 90, 80]
},
{
    name: '正常事件数',
    color: '#48c644',
    data: [60, 220, 90, 150, 320, 60, 220, 90, 150, 320, 60, 220, 90, 150, 320]
}];

var times = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];
var timed = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012];

var opts = {
    xAxis: {
        categories: times,
        formatter: function(value, diff){
            return value;
        }
    },
    yAxis: {
        size: 4
    },
    style: {
        height: 200
        // width: 1000
    },
    series: dataset,
    tooltip: {
        formatter: function(){
            var endTime = new Date(this.x).Format("YYYY-MM-dd hh:mm");
            var startTime = new Date(this.x - this.diffTime).Format("YYYY-MM-dd hh:mm");
            var s = '<p style="margin:0 0 5px 0;">从 ' + startTime + '</p>';
            s += '<p style="margin:0 0 10px 0;">至 ' + endTime + '</p>';
            $.each(this.points, function () {
                if(this.data != 0) {
                    s += '<p style="margin:2px 0;">' + '<i style="display:inline-block;width:2px;height:8px;background:' + this.color + ';margin-right:5px;"></i>' + this.name + ': ' + this.data + '个</p>';
                } else {
                    s += '';
                }
            }); 
            return s;
        }
    },
    events: {
        click: function (obj, x) {
            if (obj.h != 0) refresh(x);                    
        }
    }
}
var myChart = new uStack('#container', opts);

var render = document.getElementById('render');
var resize = document.getElementById('resize');
var left = document.getElementById('left');
var right = document.getElementById('right');
var btn1 = document.getElementById('red');
var btn2 = document.getElementById('yellow');
var btn3 = document.getElementById('grey');
var btn4 = document.getElementById('green');

function refresh(x) {
    var filters = {
        hide: [0],
        show: [1, 2]
    }
    var data = {
        data: dataset,
        time: times
    }
    myChart.middle(data, x ,filters);
}   

render.addEventListener('click', function() {   
    myChart.setCategories(times);        
    myChart.reflow(newData);
})
resize.addEventListener('click', function() {        
    myChart.setCategories(times);   
    myChart.setData(dataset);
})
left.addEventListener('click', function() {       
    myChart.setCategories(times);    
    myChart.setData('left', dataset);
})
right.addEventListener('click', function() {    
    myChart.setCategories(times);          
    myChart.setData('right',dataset);
})
btn1.addEventListener('click', function() { 
    if($(this).hasClass('active')) {
        $(this).removeClass('active')
        myChart.show(0);
    } else {
        $(this).addClass('active')
        myChart.hide(0);
    }
})
btn2.addEventListener('click', function() {           
    if($(this).hasClass('active')) {
        $(this).removeClass('active')
        myChart.show(1);
    } else {
        $(this).addClass('active')
        myChart.hide(1);
    }
})
btn3.addEventListener('click', function() {           
    if($(this).hasClass('active')) {
        $(this).removeClass('active')
        myChart.show(2);
    } else {
        $(this).addClass('active')
        myChart.hide(2);
    }
})
btn4.addEventListener('click', function() {           
    if($(this).hasClass('active')) {
        $(this).removeClass('active')
        myChart.show(3);
    } else {
        $(this).addClass('active')
        myChart.hide(3);
    }
})

function setItem() {
    for (var i = 0; i < dataset.length; i++) {
        dataset[i].data.shift();
        dataset[i].data.push(Math.random() * 200);
    }
}

