/**
 * Module that exposes the public API used to interface with the CMS
 * @param config
 * @returns {{auth: *, nodes: *}}
 */
module.exports = function api(config){
    "use strict";

    var app = require('./config/app')(config),
        auth = require('./entities/auth')(app),
        nodes = require('./entities/nodes');

    return {
        auth: auth,
        nodes: nodes
    };
};