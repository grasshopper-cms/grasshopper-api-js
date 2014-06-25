module.exports = function(app){
    'use strict';

    var system = {},
        grasshopper = require('grasshopper-core'),
        bridgetown = require('bridgetown-api'),
        Response = bridgetown.Response,
        middleware = bridgetown.middleware;

    system.getVersion = function(httpRequest, httpResponse){
        var response = new Response(httpResponse),
            val = {
                components: []
            };

        val.components.push({name: 'grasshopper-core', version: grasshopper.version});
        val.components.push({name: 'grasshopper-api', version: require('../../package.json').version});

        response.write(200, val);
    };

    //Setup Routes for included functions
    app.get('/system', [middleware.authorization, system.getVersion]);

    return system;
};