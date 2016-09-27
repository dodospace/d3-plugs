import d3 from 'd3'
import $ from 'jquery'
import _ from 'lodash'
import tip from './index'

(function(root, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = root.document ?
            factory(root, $, d3, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("uStack requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(root, $, d3);
    }
}(typeof window !== "undefined" ? window : {}, function(root, $, d3, noGlobal) {
    // var uStack,
    //     SVGElement;

    var uStack = function(element, opts) {
        if (typeof element == 'string' || typeof element == 'object') {
            this.element = element;
        } else {
            throw new Error('uStack need a DOM container');
        }

        this.svg;

        this.element = element;

        this.opts = opts;

        this.defaultHeight = 200;

        this.defaultPadding = { left: 50, right: 50, top: 30, bottom: 30 };

        this.stack;

        this.g;
        this.newG;

        this.updateGroup;
        this.exitGroup;
        this.enterGroup;

        this.updateRect;
        this.exitRect;
        this.enterRect;

        this.times = opts.xAxis.categories;
        this.formatter = opts.xAxis.formatter;
        this.diffTime = this.times[1] - this.times[0];

        this.data = opts.series;
        this.tempData = deepCopy(this.data);


        this.WIDTH = opts.style ? (opts.style.width ? opts.style.width : $(element).width()) : $(element).width();
        this.HEIGHT = opts.style ? (opts.style.height ? opts.style.height : this.defaultHeight) : this.defaultHeight;

        $(this.element).height(this.HEIGHT);

        this.xRangWidth = this.getOptions().x;
        this.yRangeWidth = this.getOptions().y;


        this.maxProfit;

        this.xScale;
        this.yScale;

        this.colors = d3.scale.category10();

        this.xAxisLine;
        this.yAxisLine;

        this.hoverTag;

        this.timer = null;

        this.tip = tip().style('opacity', 0).attr('class', 'd3-tips').html(function(d) {
            return d;
        });

        this.init();
        addEvent.call(this.tip, element);

        this.setData = this.setData;
        this.reflow = this.reflow;
        this.setCategories = this.setCategories;
        this.hide = this.hide;
        this.show = this.show;
        this.middle = this.middle;

        // 注册resize事件
        this.resize = this.resize();
    }

    uStack.prototype = {
        init: function() {

            this.svg = d3.select(this.element)
                .append('svg')
                .attr('class', 'stack-svg')
                .attr('width', this.WIDTH)
                .attr('height', this.HEIGHT).call(this.tip);
            this.g = this.svg.append('g');
            var dataset = this.formatData(this.data);
            this.stack = this.getStack(dataset);
            this.createScale();
            this.events(this.g);
            this.upAnimate();
            this.createAxis();

            window.onresize = this.resize();
        },
        // 堆栈布局
        getStack: function(dataset) {
            var stack = d3.layout.stack()
                .values(function(d) {
                    return d.data;
                })
                .x(function(i) {
                    return i;
                })
                .y(function(d) {
                    return d.data;
                });
            return stack(dataset);

        },
        // 格式化来源数据
        formatData: function(data) {
            var items = deepCopy(data);
            items.reverse();
            _.map(items, function(item, i) {
                _.map(item.data, function(value, index) {
                    item.data[index] = { 'data': value }
                })
            })
            return items;
        },
        // 定义x，y坐标系的比例尺
        createScale: function() {
            var _length = this.stack.length;
            var max = d3.max(this.stack[_length - 1].data, function(d) {
                return d.y0 + d.y
            });
            this.maxProfit = getFormatNum(max, 4)
            var time = this.times;
            this.xScale = d3.scale
                .ordinal()
                .domain(time)
                .rangeBands([0, this.xRangWidth], 0.5);
            
            this.yScale = d3.scale.linear()
                .domain([0, this.maxProfit])
                .range([0, this.yRangeWidth])
        },
        // 创建坐标轴
        createAxis: function() {
            var _this = this;
            var xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient('bottom')
                .tickSize(5, -10)
                .tickFormat(function (d) {
                    return _this.formatter(d, _this.diffTime);
                })
                
            this.xAxisLine = this.g.append('g')
                .attr('class', 'axis x-axis')
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom) + ')')
                .call(xAxis);

            var _yScale = d3.scale.linear()
                .domain([0, this.maxProfit])
                .range([this.yRangeWidth, 0]);
            var yAxis = d3.svg.axis()
                .scale(_yScale)
                .orient('left')
                .ticks(4)
            this.yAxisLine = this.svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom - this.yRangeWidth) + ')')
                .call(yAxis);
        },
        // 绘制矩形
        drawRect: function(ele) {
            var _this = this;
            this.updateGroup = ele.selectAll('g.groups')
                .data(_this.stack);
            var enterGroup = this.updateGroup.enter();
            var exitGroup = this.updateGroup.exit();
            this.updateGroup.attr('class', 'groups')
                .attr('fill', function(d, i) {
                    if (d.color) {
                        return d.color;
                    } else {
                        return _this.colors(i)
                    }
                });

            enterGroup.append('g')
                .attr('class', 'groups')
                .attr('fill', function(d, i) {
                    if (d.color) {
                        return d.color;
                    } else {
                        return _this.colors(i)
                    }
                });

            exitGroup.remove();

            this.updateRect = this.updateGroup.selectAll('rect')
                .data(function(d) {
                    return d.data;
                })
            var enterRect = this.updateRect.enter();
            var exitRect = this.updateRect.exit();

            this.updateRect.attr('x', function(d, i) {
                    return _this.xScale(_this.times[i]);
                })
                .attr('y', function(d) {
                    return _this.yRangeWidth - _this.yScale(d.y0 + d.y);
                })
                .attr('width', function(d) {
                    return _this.xScale.rangeBand();
                })
                .attr('height', function(d) {
                    return _this.yScale(d.y);
                });

            enterRect.append('rect')
                .attr('x', function(d, i) {
                    return _this.xScale(_this.times[i]);
                })
                .attr('y', function(d) {
                    return _this.yRangeWidth - _this.yScale(d.y0 + d.y);
                })
                .attr('width', function(d) {
                    return _this.xScale.rangeBand();
                })
                .attr('height', function(d) {
                    return _this.yScale(d.y);
                });
            exitRect.remove();
        },

        upAnimate: function() {
            this.updateGroup.attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom) + ')scale(1, 0)')
                .transition()
                .duration(1000)
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + this.defaultPadding.top + ')scale(1,1)')
        },
        // 注册事件
        events: function(ele) {
            this.drawRect(ele);
            var _this = this;
            var flag;
            this.updateRect.on('mouseover', function(d, i) {
                    var _x = d3.select(this).attr('x');
                    var _w = d3.select(this).attr('width');

                    var data =[{
                        x: Number(_x) + _this.defaultPadding.left,
                        y: _this.HEIGHT - _this.defaultPadding.bottom - _this.yRangeWidth,
                        width: _w,
                        height: _this.yRangeWidth
                    }];
                    _this.hoverTag = _this.svg.selectAll('rect.hover').data(data);
                    var hoverEnter = _this.hoverTag.enter();
                    var hoverExit = _this.hoverTag.exit();
                    _this.hoverTag
                        .attr('x', function(d) {
                            return d.x
                        })
                        .attr('y', function(d) {
                            return d.y
                        })
                        .attr('width', function(d) {
                            return d.width
                        })
                        .attr('height', function(d) {
                            return d.height
                        })
                        .attr('fill', '#fff')
                        .style("opacity", "0.2");
                    
                    hoverEnter.append('rect')
                        .attr('class', 'hover')
                        .attr('x', function(d) {
                            return d.x
                        })
                        .attr('y', function(d) {
                            return d.y
                        })
                        .attr('width', function(d) {
                            return d.width
                        })
                        .attr('height', function(d) {
                            return d.height
                        })
                        .attr('fill', '#fff')
                        .style("opacity", "0.2");

                    hoverExit.remove();

                    var returnObj = _this.getPoints(i);
                    var content = _this.opts.tooltip.formatter.call(returnObj);
                    var _height = d3.max(_this.yScale.range()) - Math.floor(_this.yScale(returnObj.h) / 2);
                    if (i < 2) {
                        _this.tip.offset([0, 10]).direction('e').show(content);
                        if (_this.timer) clearTimeout(_this.timer);
                        _this.timer = setTimeout(function() {
                            _this.tip.attr('class', 'd3-tips tip-animation e')
                        }, 400)
                    } else {
                        _this.tip.offset([0, -10]).direction('w').show(content);
                        if (_this.timer) clearTimeout(_this.timer);
                        _this.timer = setTimeout(function() {
                            _this.tip.attr('class', 'd3-tips tip-animation w')
                        }, 400)
                    }
                    var top = $('.stack-svg').offset().top + _this.defaultPadding.top  + _height - ($('.d3-tips').innerHeight());
                    $('.d3-tips').css('top', (top + 'px'));
                    var _y = $('.stack-svg').offset().top;
                })
                .on('mouseout', function(d, i) {
                    _this.hoverTag.on('mouseout', function () {
                        _this.hoverTag.remove()
                    })  
                    .on('click', function () {
                        _this.hoverTag.remove()
                        var obj = _this.getPoints(i);
                        var _x = d3.select(this).attr('x');
                        _this.opts.events.click.call(_this, obj, _x);                     
                    })             
                })
        },

        // 定义图形的最大x，y的值
        getOptions: function() {
            return {
                x: this.WIDTH - this.defaultPadding.left - this.defaultPadding.right,
                y: this.HEIGHT - this.defaultPadding.top - this.defaultPadding.bottom
            }
        },

        getPoints: function(index) {
            var rangeData = 0,
                arr = [];
            _.map(this.stack, function(item) {
                var obj = {
                    color: item.color,
                    data: item.data[index].data,
                    name: item.name,
                }
                rangeData += item.data[index].data;
                arr.push(obj)
            });

            var returnObj = {
                points: arr.reverse(),
                x: this.times[index],
                h: rangeData,
                diffTime: this.diffTime
            };
            return returnObj;
        },

        getEmptyData: function(data) {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                arr[i] = 0;
            }
            return arr;
        },
        // 更新矩形
        updateResize: function() {
            var _this = this;
            this.updateGroup.selectAll('rect')
                .transition()
                .attr('x', function(d, i) {
                    return _this.xScale(_this.times[i]);
                })
                .attr('width', function(d) {
                    return _this.xScale.rangeBand();
                });
        },

        setCategories: function(times) {
            this.times = times;
            this.diffTime = times[1] - this.times[0];
        },
        // 渲染
        render: function(element) {
            var _this = this;
            this.WIDTH = $(element).width();
            this.svg.attr('width', this.WIDTH);
            this.xRangWidth = this.getOptions().x;
            this.yRangeWidth = this.getOptions().y;
            this.xScale = d3.scale
                .ordinal()
                .domain(this.times)
                .rangeBands([0, this.xRangWidth], 0.5);
            var xAxis = d3.svg.axis()
                .scale(this.xScale)
                .tickSize(5, -10)
                .tickFormat(function (d) {
                    return _this.formatter(d, _this.diffTime);
                })
                .orient('bottom');
            this.xAxisLine.transition()
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom) + ')')
                .call(xAxis);
            this.updateResize();
            addEvent.call(this.tip, element);
        },
        // 屏幕resize事件
        resize: function() {
            var timer = null;
            var previous = null;
            var self = this;
            return function() {
                var now = +new Date();
                if (!previous) previous = now;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    self.render(self.element);
                }, 200)
            }
        },

        reflow: function(data) {
            if (data && data.length > 0) {
                this.renderData(data);
                this.data = data;
                this.tempData = deepCopy(this.data);
            }
            this.upAnimate();
        },

        left: function() {
            this.g.attr('transform', 'scale(1, 1)')
                .transition()
                .duration(1000)
                .attr('transform', 'translate(' + (this.xRangWidth + this.defaultPadding.left) + ', 0)scale(0, 1)')
                .remove()
            this.newG.attr('transform', 'translate(' + (this.defaultPadding.left) + ', 0)scale(0, 1)')
                .transition()
                .duration(1000)
                .attr('transform', 'translate(0, 0)scale(1, 1)');
            this.g = this.newG;
        },

        right: function() {
            this.g.attr('transform', 'scale(1, 1)')
                .transition()
                .duration(1000)
                .attr('transform', 'translate(' + (this.defaultPadding.left) + ', 0)scale(0, 1)')
                .remove()
            this.newG.attr('transform', 'translate(' + (this.xRangWidth + this.defaultPadding.left) + ', 0)scale(0, 1)')
                .transition()
                .duration(1000)
                .attr('transform', 'translate(0, 0)scale(1, 1)');
            this.g = this.newG;
        },

        middle: function(data, x, filters) {
            var _data = data.data;
            var _this = this;
            this.data = _data;
            this.times = data.time;
            this.tempData = deepCopy(this.data);
            if (filters.length > 0) {
                _.map(filters, function (item) {
                    const index = Number(item);
                    var arr = this.data[index].data;
                    var emptyData = this.getEmptyData(arr);
                    this.tempData[index].data = emptyData;
                }.bind(this))
            }
            if (_data && _data.length > 0) {
                this.renderData(this.tempData);
                this.updateRect.attr('x', Number(x) - this.defaultPadding.left)
                    .transition()
                    .duration(500)
                    .attr('x', function(d, i) {
                        return _this.xScale(_this.times[i]);
                    })
            }
        },

        hide: function(index) {
            if (!this.data[index]) throw new Error('Data error, Checkout Your Data Resources');
            var arr = this.data[index].data;
            var emptyData = this.getEmptyData(arr);
            this.tempData[index].data = emptyData;
            this.renderData(this.tempData);
        },

        show: function(index) {
            if (!this.data[index]) throw new Error('Data error, Checkout Your Data Resources');
            this.tempData[index].data = this.data[index].data;
            this.renderData(this.tempData);
        },

        updateShowAndHide: function() {

        },

        renderData: function(data, type) {
            var dataset = this.formatData(data);
            this.stack = this.getStack(dataset);
            this.createScale();
            var _this = this;            
            var xAxis = d3.svg.axis()
                .scale(this.xScale)
                .tickSize(5, -10)
                .tickFormat(function (d) {
                    return _this.formatter(d, _this.diffTime);
                })
                .orient('bottom');
            var _yScale = d3.scale.linear()
                .domain([0, this.maxProfit])
                .range([this.yRangeWidth, 0]);
            var yAxis = d3.svg.axis()
                .scale(_yScale)
                .orient('left')
                .ticks(4)
            this.yAxisLine.attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom - this.yRangeWidth) + ')')
                .call(yAxis);
            
            if (type == 'left' || type == 'right') {
                this.newG = this.svg.append('g');
                this.events(this.newG);
                this.xAxisLine = this.newG.append('g')
                    .attr('class', 'axis x-axis')
                    .attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom) + ')')
                    .call(xAxis);
            } else {
                this.events(this.g);
                this.xAxisLine.attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom) + ')')
                    .call(xAxis);
            }
        },

        setData: function() {
            let type = '',
                data,
                args = arguments;

            if (arguments.length == 0) return;

            if (typeof args[0] == 'string') {
                type = args[0];
                if (args[1] && typeof args[1] == 'object' && args[1].length > 0) {
                    data = args[1];
                } else {
                    throw new Error('The data format is not correct, Please Checkout Your Data argments')
                }
            } else {
                if (typeof args[0] == 'object' && args[0].length > 0) {
                    data = args[0];
                } else {
                    throw new Error('The data format is not correct, Please Checkout Your Data argments')
                }
            }

            var _this = this;
            this.data = data;
            this.tempData = deepCopy(this.data);
            this.renderData(data, type);
            this.updateGroup.attr('transform', 'translate(' + this.defaultPadding.left + ',' + this.defaultPadding.top + ')scale(1,1)')

            switch (type) {
                case 'right':
                    _this.right();
                    break;
                case 'left':
                    _this.left();
                    break;
                default:
                    break;
            }
        }
    }

    // 深度复制
    function deepCopy(parent, child) {
        child = child || [];
        for (var i in parent) {
            if (parent.hasOwnProperty(i)) {
                //检测当前属性是否为对象 
                if (typeof parent[i] === "object") {
                    //如果当前属性为对象，还要检测它是否为数组
                    //这是因为数组的字面量表示和对象的字面量表示不同
                    //前者是[],而后者是{}
                    child[i] = (Object.prototype.toString.call(parent[i]) === "[object Array]") ? [] : {};
                    //递归调用extend
                    deepCopy(parent[i], child[i]);
                } else {
                    child[i] = parent[i];
                }
            }
        }
        return child;
    }

    function addEvent(ele) {
        var _this = this,
            $svg = $('.stack-svg');
        var _width = $svg.width(),
            _height = $svg.height(),
            _x = $svg.offset().left,
            _y = $svg.offset().top,
            maxX = _x + _width,
            maxY = _y + _height;

        document.onmousemove = function(ev) {
            ev = ev || window.event;
            var mousePos = mousePosition(ev);
            // console.log('鼠标的X坐标是' + mousePos.x + ',鼠标的Y坐标是' + mousePos.y);
            // console.log('SVG的X范围是' + _x + '-' + maxX);
            if (!((mousePos.x > _x && mousePos.x < maxX) && (mousePos.y > _y && mousePos.y < maxY))) {
                $('.d3-tips').css({
                    opacity: 0,
                });
                clearTimeout(_this.timer);
            }
        }

        function mousePosition(ev) {
            if (ev.pageX || ev.pageY) { //firefox、chrome等浏览器
                return { x: ev.pageX, y: ev.pageY };
            }
            return { // IE浏览器
                x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        }
    }


    // 整数粒度对齐算法
    function getFormatNum(num, size) {
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

    if (!noGlobal) {
        window.uStack = uStack;
    }
    return uStack;

}));