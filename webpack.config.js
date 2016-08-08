'use strict';
const path = require('path');
const webpack = require('webpack');
const SplitByPathPlugin = require('webpack-split-by-path')

module.exports = {
    cache: true,

    // each value on this object is now an array and MUST have the extra modules
    entry: {
        core :       ['./lib/admin/client/core'],
        components : ['./lib/admin/client/components']
    },

    // we use ES2015; we will want source maps for development
    devtool: 'source-map',

    // this is a default value; just be aware of it
    target: 'web',
    colors: true,
    errorDetails: true,

    // "path" is now "/" because we're building our app into memory now rather than a build folder
    // "publicPath" is where the hosted app expects the resources
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'lib', 'admin', 'public'),
        publicPath: 'http://localhost:3008/'
    },

    plugins: [
        new SplitByPathPlugin([{
            name: 'vendor',
            path: path.join(__dirname, '..', 'node_modules')
        }]),

        new webpack.ProvidePlugin({
            riot: 'riot'
        })
    ],

    resolve: {
        extensions: ['', '.js', 'map']
    },

    module: {
        preLoaders: [
            { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { template: 'pug' } },
            // Don't think tag files are really working yet
            { test: /\.js$|\.tag$/, loader: "eslint-loader", exclude: /node_modules/}
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,

                // "loader" property changed to "loaders" and is now an array!
                loaders: [
                    // webpack forbids the "loader.query" property when you have multiple loaders; use a queryString to pass those details
                    'babel'
                ]
            }
        ]
    }
};
