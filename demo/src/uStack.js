import d3 from 'd3'
import $ from 'jquery'
import _ from 'lodash'
import tip from 'd3-tip';

(function(root, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = root.document ?
            factory(root, $, d3, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("uChart requires a window with a document");
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
            throw new Error('uChart need a DOM container');
        }

        this.svg;

        this.opts = opts;

        this.defaultHeight = 200;

        this.defaultPadding = { left: 50, right: 100, top: 30, bottom: 30 };

        this.stack;

        this.g;

        this.times = opts.xAxis.categories;

        this.data = this.formatData(opts.series);

        this.WIDTH = opts.style ? (opts.style.width ? opts.style.width : $(element).width()) : $(element).width();
        this.HEIGHT = opts.style ? (opts.style.height ? opts.style.height : this.defaultHeight) : this.defaultHeight;

        this.xRangWidth = this.WIDTH - this.defaultPadding.left - this.defaultPadding.right;
        this.yRangeWidth = this.HEIGHT - this.defaultPadding.top - this.defaultPadding.bottom;

        this.xScale;
        this.yScale;

        this.tip = tip().attr('class', 'd3-tip').html(function(d) {
            return d;
        });

        this.init();
    }

    uStack.prototype = {
        init: function() {
            this.svg = d3.select(this.element)
                .append('svg')
                .attr('width', this.WIDTH)
                .attr('height', this.HEIGHT).call(this.tip);
            this.g = this.svg.append('g');
            this.getStack();
            this.createScale();
            this.drawRect();
            this.createAxis();
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
            var items = data;
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
            var maxProfit = d3.max(this.stack[_length - 1].data, function(d) {
                return d.y0 + d.y
            });
            this.xScale = d3.scale
                .ordinal()
                .domain(this.times)
                .rangeBands([0, this.xRangWidth], 0.5);
            this.yScale = d3.scale.linear()
                .domain([0, maxProfit])
                .range([0, this.yRangeWidth])
                // this.yScale.domain(ticks);

        },
        createAxis: function() {
            var xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient('bottom');
            this.svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom) + ')')
                .call(xAxis);
            var yAxis = d3.svg.axis()
                .scale(this.yScale)
                .orient('left')
                .ticks(2)
            this.yScale.range([this.yRangeWidth, 0]);

            this.svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom - this.yRangeWidth) + ')')
                .call(yAxis);
        },
        drawRect: function() {
            var _this = this;
            var groups = this.g.selectAll('g')
                .data(_this.stack)
                .enter()
                .append('g')
                .attr('fill', function(d) {
                    return d.color;
                });
            var rects = groups.selectAll('rect')
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
                console.log(d3.select(this).attr('x'));
                var arr = [];
                _.map(_this.stack, function(item, j) {
                    var obj = {
                        color: item.color,
                        data: item.data[i].data,
                        name: item.name
                    }
                    arr.push(obj)
                })
                var retrunObj = {
                    points: arr,
                    x: _this.times[i]
                };
                var content = _this.opts.tooltip.formatter.call(retrunObj);
                _this.tip.show(content);
            })
            groups.attr('transform', 'translate(' + this.defaultPadding.left + ',' + (this.HEIGHT - this.defaultPadding.bottom) + ')scale(1, 0)')
                .transition()
                .duration(1000)
                .attr('transform', 'translate(' + this.defaultPadding.left + ',' + this.defaultPadding.top + ')scale(1,1)')
        }
    }
    if (!noGlobal) {
        window.uStack = uStack;
    }
    return uStack;
}));