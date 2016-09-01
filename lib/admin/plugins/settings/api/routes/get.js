'use strict';

var grasshopperInstance = require('../../../../grasshopper/instance'),
    Response = grasshopperInstance.bridgetown.Response,
    getRoutesFromGrasshopper = require('./getRoutesFromGrasshopper');

module.exports = [
    grasshopperInstance.bridgetown.middleware.authorization,
    grasshopperInstance.bridgetown.middleware.authToken,
    function(request, response, next) {
        if(request.bridgetown.identity.role === 'admin') {
            next();
        } else {
            new Response(response).writeUnauthorized();
        }
    },
    _handleGetRoutesFromGrasshopper
];

function _handleGetRoutesFromGrasshopper(request, response) {
    new Response(response).writeSuccess(getRoutesFromGrasshopper());
}