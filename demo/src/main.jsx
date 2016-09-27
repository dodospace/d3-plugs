window.$ = require('zepto');
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
    data: [0, 200, 30, 50, 120, 0, 200, 30, 50, 120, 100, 200]
}, {
    name: '警告事件数',
    color: '#ffef3f',
    data: [60, 220, 0, 150, 320, 60, 220, 90, 150, 320, 60, 220]
}, {
    name: '提醒事件数',
    color: '#9ea0b6',
    data: [300, 120, 20, 90, 80, 300, 120, 20, 90, 80, 0, 120]
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
        click: function (obj) {
            return {
                data: newData,
                time: timed
            };          
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

render.addEventListener('click', function() {   
    myChart.setCategories(timed);        
    myChart.reflow(newData);
})
resize.addEventListener('click', function() {        
    myChart.setCategories(times);   
    myChart.setData(dataset);
})
left.addEventListener('click', function() {       
    myChart.setCategories(timed);    
    myChart.setData('left', newData);
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


var num = 76;

function getFormatNum(num, size) {
    var size = size || 4;
    var average = num / size;
    var max;
    if (average > 10) {
        if (num % size == 0) {
            var _c = num / size;
            var arr = average.toString().split('');
            var value;
            if (_c % Math.pow(10, (arr.length - 1)) == 0) {
                value = arr[0] * Math.pow(10, (arr.length - 1));
            } else {                
                value = format(arr);
            }      
            max = value * size;            
        } else {
            var arr = Math.floor(num / size).toString().split('');
            var lastNum = arr[arr.length - 1];
            arr[arr.length - 1] = Number(lastNum) + 1;
            var value = format(arr);
            max = value * size;
        }
    } else {
        if (average == 10 || average > 5) {
            max = 10 * size;
        } else {
            max = 5 * size;
        }
    }
    function format(arr) {        
        var firstNum = arr[0];
        var _size;
        console.log(arr);     
        if (arr.length > 2) {
            if ((arr[1] == 5 && arr[arr.length - 1] != 0) || arr[1] > 5) {
                arr[0] = Number(firstNum) + 1;
                _size = arr[0] * Math.pow(10, (arr.length - 1));
            } else {
                _size = (Number(arr[0]) + 0.5) * Math.pow(10, (arr.length - 1));
            }
        } else {
            if (arr[1] > 5) {
                arr[0] = Number(firstNum) + 1;
                _size = arr[0] * Math.pow(10, (arr.length - 1));
            } else {
                _size = (Number(arr[0]) + 0.5) * Math.pow(10, (arr.length - 1));
            }
        }        
        return _size;
    }
    return max;
}

console.log(getFormatNum(133, 3));