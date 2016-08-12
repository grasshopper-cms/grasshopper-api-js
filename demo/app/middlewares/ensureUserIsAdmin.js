'use strict';

var grasshopperInstance = require('../grasshopper/instance'),
    Response = grasshopperInstance.bridgetown.Response;

module.exports = function(request, response, next) {
    if(request.bridgetown.identity.role === 'admin') {
        next();
    } else {
        new Response(response).writeUnauthorized();
    }
};

