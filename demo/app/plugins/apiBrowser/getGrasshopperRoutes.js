'use strict';

var grasshopperInstance = require('../../grasshopper/instance');

module.exports = function() {
    return grasshopperInstance.router.stack
        .filter(function(route) {
            // take out all the middleware
            return route.route;
        })
        .map(function(route) {
            return {
                path : route.route.path,
                methods : Object.keys(route.route.methods)
                    .filter(function(key) {
                        return route.route[key];
                    })
            };
        });
};