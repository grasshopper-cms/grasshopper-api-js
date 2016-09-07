'use strict';

var grasshopper = require('../../grasshopper'),
    Response = grasshopper.instance.bridgetown.Response,
    getRoutesFromGrasshopper = require('./getRoutesFromGrasshopper');

module.exports = [
    grasshopper.instance.bridgetown.middleware.authorization,
    grasshopper.instance.bridgetown.middleware.authToken,
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