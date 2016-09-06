'use strict';

module.exports = function(grasshopperInstance) {
    return grasshopperInstance.admin.stack
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