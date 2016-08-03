var _ = require('lodash');
var scripts = require('./scripts')
var baseConfig = require('./base.config')
var path = require('path');
var webpack = require('webpack');


var config = _.merge(baseConfig, {
    entry: _.merge({
            bundle: './demo/src/main.jsx'
        },
        scripts.chunks
    ),
    output: {
        path: path.resolve(__dirname, '../demo/web/build'),
        publicPath: 'build/',
        filename: '[name].js',
        chunkFilename: 'chunk.[id].js',
        pathinfo: true
    },
    devServer: {
        contentBase: './demo/web',
        devtool: 'eval',
        port: 8009,
        hot: true,
        inline: true
    },
    devtool: 'eval'

});

module.exports = config;