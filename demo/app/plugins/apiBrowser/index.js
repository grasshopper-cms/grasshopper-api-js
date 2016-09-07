'use strict';

var BB = require('bluebird'),
    defaultsDeep = require('lodash/defaultsDeep'),
    getAdminRoutes = require('./getAdminRoutes'),
    getGrasshopperRoutes = require('./getGrasshopperRoutes');

module.exports = {
    get : get
};

function get(request, response) {
    BB.join(getAdminRoutes(), getGrasshopperRoutes(), function(adminRoutes, grasshopperRoutes) {
        response.render(require.resolve('./template.pug'),
            defaultsDeep({
                adminRoutes : adminRoutes,
                grasshopperRoutes : grasshopperRoutes
            },
            response.locals));
    });
}