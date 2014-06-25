module.exports = function(app){
    'use strict';

    var api = {},
        grasshopper = require('grasshopper-core'),
        bridgetown = require('bridgetown-api'),
        Response = bridgetown.Response,
        middleware = bridgetown.middleware;

    api.getById = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).content.getById(httpRequest.params.id);
        new Response(httpResponse).writeFromPromise(promise);
    };

    api.deleteById = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).content.deleteById(httpRequest.params.id);
        new Response(httpResponse).writeFromPromise(promise);
    };

    api.update = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).content.update(httpRequest.body);
        new Response(httpResponse).writeFromPromise(promise);
    };

    api.insert = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).content.insert(httpRequest.body);
        new Response(httpResponse).writeFromPromise(promise);
    };

    api.query = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).content.query(httpRequest.body);
        new Response(httpResponse).writeFromPromise(promise);
    };

    app.post('/content', [middleware.authorization, middleware.authToken, api.insert]);

    app.post('/content/query', [middleware.authorization, middleware.authToken, api.query]);

    app.put('/content/:id', [middleware.authorization, middleware.authToken, api.update]);

    app.get('/content/:id', [middleware.authorization, middleware.authToken, api.getById]);

    app.delete('/content/:id', [middleware.authorization, middleware.authToken, api.deleteById]);

    return api;
};