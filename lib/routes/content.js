module.exports = function(router){
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

    api.getFullById = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).content.getFullById(httpRequest.params.id);
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

    api.queryFull = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).content.queryFull(httpRequest.body);
        new Response(httpResponse).writeFromPromise(promise);
    };

    router.post('/content', [middleware.authorization, middleware.authToken, api.insert]);

    router.post('/content/query', [middleware.authorization, middleware.authToken, api.query]);

    router.post('/content/query/full', [middleware.authorization, middleware.authToken, api.queryFull]);

    router.route('/content/:id')
        .put([middleware.authorization, middleware.authToken, api.update])
        .get([middleware.authorization, middleware.authToken, api.getById])
        .delete([middleware.authorization, middleware.authToken, api.deleteById]);

    router.route('/content/:id/full')
        .get([middleware.authorization, middleware.authToken, api.getFullById]);
    return api;
};