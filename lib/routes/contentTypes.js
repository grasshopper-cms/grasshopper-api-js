module.exports = function(app){
    'use strict';

    var contentTypes = {},
        grasshopper = require('grasshopper-core'),
        bridgetown = require('bridgetown-api'),
        Response = bridgetown.Response,
        middleware = bridgetown.middleware,
        Request = require('../utils/request'),
        routePrefix = (app.get('grasshopper route prefix')) ? app.get('grasshopper route prefix') : '',
        request = new Request();

    contentTypes.getById = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).contentTypes.getById(httpRequest.params.id);
        new Response(httpResponse).writeFromPromise(promise);
    };

    contentTypes.deleteById = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).contentTypes.deleteById(httpRequest.params.id);
        new Response(httpResponse).writeFromPromise(promise);
    };

    contentTypes.getList = function (httpRequest, httpResponse){
        var limit = request.getListPageSize(httpRequest),
            skip = request.getListSkipSize(httpRequest),
            promise = grasshopper.request(httpRequest.bridgetown.token).contentTypes.list({ limit: limit, skip: skip });

        new Response(httpResponse).writeFromPromise(promise);
    };

    contentTypes.insert = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).contentTypes.insert(httpRequest.body);
        new Response(httpResponse).writeFromPromise(promise);
    };

    contentTypes.update = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).contentTypes.update(httpRequest.body);
        new Response(httpResponse).writeFromPromise(promise);
    };

    app.get(routePrefix + '/contenttypes', [middleware.authorization, middleware.authToken, contentTypes.getList]);
    app.get(routePrefix + '/contenttypes/:id', [middleware.authorization, middleware.authToken, contentTypes.getById]);
    app.delete(routePrefix + '/contenttypes/:id', [middleware.authorization, middleware.authToken, contentTypes.deleteById]);
    app.put(routePrefix + '/contenttypes', [middleware.authorization, middleware.authToken, contentTypes.update]);
    app.put(routePrefix + '/contenttypes/:id', [middleware.authorization, middleware.authToken, contentTypes.update]);
    app.post(routePrefix + '/contenttypes', [middleware.authorization, middleware.authToken, contentTypes.insert]);

    return contentTypes;
};