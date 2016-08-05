import d3 from 'd3'
import $ from 'jquery'
import _ from 'lodash'
import tip from 'd3-tip'
import Immutable from 'immutable'

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
    var uStack = function(element, opts) {
        if (typeof element == 'string') {
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

        this.groups;

        this.times = opts.xAxis.categories;

        this.data = this.formatData(opts.series);

        this.WIDTH = opts.style ? (opts.style.width ? opts.style.width : $(element).width()) : $(element).width();
        this.HEIGHT = opts.style ? (opts.style.height ? opts.style.height : this.defaultHeight) : this.defaultHeight;

        $(this.element).height(this.HEIGHT);

        this.xRangWidth = this.getOptions().x;
        this.yRangeWidth = this.getOptions().y;


        this.maxProfit;

        this.xScale;
        this.yScale;

        this.xAxisLine;
        this.yAxisLine;

        this.timer = null;

        this.tip = tip().style('opacity', 0).attr('class', 'd3-tip').html(function(d) {
            return d;
        });

        this.init();
        addEvent.call(this.tip, element);

        this.setData = this.setData;

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
            this.getStack();
            this.createScale();
            this.drawRect();
            this.createAxis();

            window.onresize = this.resize();
        },
        getStack: function() {
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
            this.stack = stack(this.data);

        },
        formatData: function(data) {
            var items = data.reverse();
            _.map(items, function(item, i) {
                _.map(item.data, function(value, index) {
                    item.data[index] = { 'data': value }
                })
            })
            return items;
        },
        getItemData: function(data) {
            console.log(this.stack);
        },
        createScale: function() {
            var _length = this.stack.length;
            this.maxProfit = d3.max(this.stack[_length - 1].data, function(d) {
                return d.y0 + d.y
            });
            this.xScale = d3.scale
                .ordinal()
                .domain(this.times)
                .rangeBands([0, this.xRangWidth], 0.5);
            this.yScale = d3.scale.linear()
                .domain([0, this.maxProfit])
                .range([0, this.yRangeWidth])

        },
        createAxis: function() {
            var xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient('bottom');
            this.xAxisLine = this.svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom) + ')')
                .call(xAxis);

            // this.yScale.range([this.yRangeWidth, 0]);
            var _yScale = d3.scale.linear()
                .domain([0, this.maxProfit])
                .range([this.yRangeWidth, 0]);
            var yAxis = d3.svg.axis()
                .scale(_yScale)
                .orient('left')
                .ticks(4)
            this.svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom - this.yRangeWidth) + ')')
                .call(yAxis);
        },
        drawRect: function() {
            var _this = this;
            this.groups = this.g.selectAll('g')
                .data(_this.stack)
                .enter()
                .append('g')
                .attr('class', 'groups')
                .attr('fill', function(d) {
                    return d.color;
                });
            var rects = this.groups.selectAll('rect')
                .data(function(d) {
                    return d.data;
                })
                .enter()
                .append('rect')
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

            rects.on('mouseover', function(d, i) {
                    d3.selectAll('.groups').selectAll('rect').select(function(da, k) {
                        return i == k ? this : null;
                    }).style("opacity", "0.8");
                    var rangeData = 0,
                        arr = [];
                    _.map(_this.stack, function(item) {
                        var obj = {
                            color: item.color,
                            data: item.data[i].data,
                            name: item.name
                        }
                        rangeData += item.data[i].data;
                        arr.push(obj)
                    });

                    var retrunObj = {
                        points: arr.reverse(),
                        x: _this.times[i]
                    };

                    var content = _this.opts.tooltip.formatter.call(retrunObj);
                    var _height = d3.max(_this.yScale.range()) - Math.floor(_this.yScale(rangeData) / 2);

                    if (i < 2) {
                        _this.tip.offset([0, 10]).direction('e').show(content);
                        if (_this.timer) clearTimeout(_this.timer);
                        _this.timer = setTimeout(function() {
                            _this.tip.attr('class', 'd3-tip tip-animation e')
                        }, 400)
                    } else {
                        _this.tip.offset([0, -10]).direction('w').show(content);
                        if (_this.timer) clearTimeout(_this.timer);
                        _this.timer = setTimeout(function() {
                            _this.tip.attr('class', 'd3-tip tip-animation w')
                        }, 400)
                    }
                    var top = $('.stack-svg').offset().top + _this.defaultPadding.top + _height - ($('.d3-tip').innerHeight());
                    $('.d3-tip').css('top', (top + 'px'));

                    var _y = $('.stack-svg').offset().top;
                })
                .on('mouseout', function(d, i) {
                    d3.selectAll('.groups').selectAll('rect').select(function(da, k) {
                        return i == k ? this : null;
                    }).style("opacity", "1");
                })

            this.groups.attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom) + ')scale(1, 0)')
                .transition()
                .duration(1000)
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + this.defaultPadding.top + ')scale(1,1)')
        },

        getOptions: function() {
            return {
                x: this.WIDTH - this.defaultPadding.left - this.defaultPadding.right,
                y: this.HEIGHT - this.defaultPadding.top - this.defaultPadding.bottom
            }
        },

        updateRect: function() {
            var _this = this;
            this.groups.selectAll('rect')
                .transition()
                .attr('x', function(d, i) {
                    return _this.xScale(_this.times[i]);
                })
                .attr('width', function(d) {
                    return _this.xScale.rangeBand();
                });
        },

        render: function(element) {
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
                .orient('bottom');
            this.xAxisLine.transition()
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom) + ')')
                .call(xAxis);
            this.updateRect();
            addEvent.call(this.tip, element);
        },

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

        left: function() {

        },

        right: function() {
            console.log(this.data);
        },

        steping: function() {
            console.log(this.data);
        },

        setData: function() {
            var type = '',
                data,
                args = arguments;

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
            this.data = data ? this.formatData(data) : this.data;
            
            switch (type) {
                case 'right':
                    _this.open();
                    break;
                case 'left':
                    _this.left();
                    break;
                default:
                    _this.steping();
                    break;
            }
        }
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
                $('.d3-tip').css({
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

    if (!noGlobal) {
        window.uStack = uStack;
    }
    return uStack;

}));