import d3 from 'd3'
import $ from 'jquery'
import _ from 'lodash'

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
    var uChart = function(element, opts) {
        if (typeof element == 'string') {
            this.element = element;
        } else {
            throw new Error('uChart need a DOM container');
        }

        if (typeof opts.series == 'undefined') throw new Error('options参数异常');
        if (typeof opts.series.data == 'undefined') throw new Error('无数据或数据异常');
        // SVG画布容器
        this.svg;

        // 分组容器
        this.g;

        // 索引元素
        this.arrow

        // 渲染DOM节点
        this.element = element;

        // default Rect's height
        this.defaultHeight = 10;

        // 索引箭头大小
        this.arrowSize = 12;

        // 对opts进行重新封装
        this.opts = this.getOptions(opts);

        // 索引序号
        this.pageIndex = this.opts.pageIndex || 1;

        // 鼠标滑过rect的高度增量
        this.rectScaleHeight = 6;
        this.init(this.opts);

        // 注册resize事件
        this.resize = this.resize();
    }

    uChart.prototype = {
        init: function(opts) {
            this.svg = d3.select(this.element)
                .append('svg')
                .attr('width', opts.style.width)
                .attr('height', opts.style.height + opts.style.padding.paddingTop + opts.style.padding.paddingBottom + this.rectScaleHeight);
            this.g = this.svg.append('g').attr('class', 'stack');
            var setting = this.getRectOptions();
            opts.pageIndex && this.createIndex();
            this.drawrect(setting);
            var n = opts.series.data.length;
            var translateX = (setting.width - (Math.floor(setting.width / n) * n)) / 2;
            var scale = setting.width / (Math.floor(setting.width / n) * n);
            this.g.attr('transform', 'scale(0.2, 1)')
                .transition()
                .duration(500)
                .attr('transform', 'scale(' + scale + ', 1)');
            window.onresize = this.resize();
        },

        // 对参数格式化
        getOptions: function(opts) {
            var _width,
                _height,
                _padding;
            var arrow = this.arrowSize / 2;

            if (opts.style) {
                _width = opts.style.width ? opts.style.width : $(this.element).width();
                _height = opts.style.height ? opts.style.height : this.defaultHeight;

            } else {
                _width = $(this.element).width();
                _height = this.defaultHeight;
            }
            var _str = typeof opts.style != 'undefined' ? opts.style.padding : {};
            _padding = formatPadding(_str);

            // 格式化padding属性
            function formatPadding(padding) {
                if (typeof padding == 'string') {
                    var str = padding.split(' ');
                    return {
                        paddingTop: Number(str[0]) + arrow,
                        paddingRight: Number(str[1]),
                        paddingBottom: Number(str[2]),
                        paddingLeft: Number(str[3]),
                    }
                } else {
                    return {
                        paddingTop: 0 + arrow,
                        paddingRight: 0,
                        paddingBottom: 0,
                        paddingLeft: 0,
                    }
                }
            }

            return _.merge(opts, {
                style: {
                    width: _width,
                    height: _height,
                    padding: _padding
                }
            });
        },

        // rect参数
        getRectOptions: function() {
            var _padding = this.opts.style.padding;
            var width = this.opts.style.width - _padding.paddingLeft - _padding.paddingRight;
            var height = this.opts.style.height;
            var dataset = this.opts.series.data;
            return {
                padding: _padding,
                width: width,
                height: height,
                dataset: dataset
            }
        },

        // 绘制
        drawrect: function(setting) {
            var padding = setting.padding,
                width = setting.width,
                height = setting.height,
                dataset = setting.dataset;

            var self = this;
            var rectWidth = Math.floor(width / dataset.length);
            this.opts.pageIndex && this.arrow.attr('transform', 'translate(' + (this.pageIndex * rectWidth - this.arrowSize / 2 - rectWidth / 2) + ',0)');

            var color = d3.scale.quantize()
                .domain(this.opts.series.color.domain)
                .range(this.opts.series.color.range);

            var rectUpdate = this.g.selectAll('rect').data(dataset);
            var rectEnter = rectUpdate.enter();
            var rectExit = rectUpdate.exit();

            rectUpdate.attr('fill', function(d) {
                    return color(d);
                })
                .attr('x', function(d, i) {
                    return padding.paddingLeft + i * rectWidth;
                })
                .attr('y', padding.paddingTop + this.rectScaleHeight / 2)
                .attr('width', rectWidth + 1) // 此处补1像素防止分辨率低的屏幕显示间隙
                .attr('height', height)
                .attr('cursor', 'pointer')

            rectEnter.append('rect')
                .attr('x', function(d, i) {
                    return padding.paddingLeft + i * rectWidth;
                })
                .attr('y', padding.paddingTop + this.rectScaleHeight / 2)
                .attr('width', rectWidth + 1)
                .attr('height', height)
                .attr('fill', function(d) {
                    return color(d);
                })
                .on('mouseover', function(d) {
                    var _color = d3.rgb(color(d));
                    d3.select(this)
                        .attr('height', height + self.rectScaleHeight)
                        .attr('y', padding.paddingTop);
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .attr('height', height)
                        .attr('y', padding.paddingTop + self.rectScaleHeight / 2);
                })
                .on('click', function(d, i) {

                    if (self.opts.pageIndex) {
                        var _width = d3.select(this).attr('width') - 1;
                        self.pageIndex = (i + 1);
                        self.arrow.transition()
                            .attr('transform', 'translate(' + ((i + 1) * _width - self.arrowSize / 2 - _width / 2) + ',0)')
                    }

                    if (self.opts.events) {
                        self.opts.events.click && self.opts.events.click(d, i);
                    }
                })

            rectExit.remove();
        },

        createIndex: function() {
            this.arrow = this.g.append('g');
            this.arrow.append('polygon')
                .attr('points', '0,0 ' + this.arrowSize + ',0 ' + this.arrowSize / 2 + ',' + this.arrowSize / 2)
                .attr('fill', 'white');
        },

        // 屏幕resize
        resize: function() {
            var timer = null;
            var previous = null;
            var self = this;
            return function() {
                var now = +new Date();
                if (!previous) previous = now;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    self._render()
                }, 200)
            }
        },

        _render: function() {
            var oldSetting = this.getRectOptions();
            var width = $(this.element).width() - oldSetting.padding.paddingLeft - oldSetting.padding.paddingRight;
            this.svg.attr('width', $(this.element).width());
            var setting = _.merge(this.getRectOptions(), {
                width: width
            });
            var n = this.opts.series.data.length;
            var translateX = (width - (Math.floor(width / n) * n)) / 2;
            this.drawrect(setting);
            this.g.attr('transform', 'translate(' + translateX + ',0)');
        }
    }

    if (!noGlobal) {
        window.uChart = uChart;
    }
    return uChart;
}));