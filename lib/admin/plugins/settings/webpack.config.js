'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry : './client/index.js',
    output : {
        path : path.resolve(__dirname, 'assets'),
        publicPath : '/admin/plugins/settings/',
        filename : 'bundle.js'
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    devtool: '#eval-source-map'
};