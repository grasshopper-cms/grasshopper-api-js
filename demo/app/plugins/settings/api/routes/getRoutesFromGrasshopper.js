'use strict';

var grasshopperInstance = require('../../../../grasshopper/instance');

module.exports = function() {
    console.log('Getting Active Routes');
    return grasshopperInstance.admin.stack // registered routes
        .filter(function(route) {// take out all the middleware
            return route.route;
        })
        .map(function(route) {
            return {
                path : route.route.path,
                methods : route.route.methods
            };
        });
};