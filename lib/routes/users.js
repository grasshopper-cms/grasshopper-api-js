module.exports = function(app){
    'use strict';

    var user = {},
        bridgetown = require('bridgetown-api'),
        grasshopper = require('grasshopper-core'),
        middleware = bridgetown.middleware,
        Response = bridgetown.Response,
        Request = require('../utils/request'),
        routePrefix = (app.get('grasshopper route prefix')) ? app.get('grasshopper route prefix') : '',
        request = new Request();

    function writeApiResponse(httpResponse, promise){
        var response = new Response(httpResponse);
        response.writeFromPromise(promise);
    }

    user.getCurrentUser = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).users.current();
        writeApiResponse(httpResponse, promise);
    };

    user.getById = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).users.getById(httpRequest.params.id);
        writeApiResponse(httpResponse, promise);
    };

    user.deleteById = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).users.deleteById(httpRequest.params.id);
        writeApiResponse(httpResponse, promise);
    };

    user.getList = function (httpRequest, httpResponse){
        var limit = request.getListPageSize(httpRequest),
            skip = request.getListSkipSize(httpRequest),
            promise = grasshopper.request(httpRequest.bridgetown.token).users.list({
                    query: {},
                    limit: limit,
                    skip: skip
                });

        writeApiResponse(httpResponse, promise);
    };

    user.update = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).users.update(httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    user.create = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).users.insert(httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    user.updatePermission = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).users.savePermissions(httpRequest.params.id, httpRequest.body.nodeid, httpRequest.role);
        writeApiResponse(httpResponse, promise);
    };

    user.deletePermission = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).users.deletePermissions(httpRequest.params.id, httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    user.query = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).users.query(httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    app.get(routePrefix + '/users', [middleware.authorization, middleware.authToken, user.getList]);
    app.get(routePrefix + '/user', [middleware.authorization, middleware.authToken, user.getCurrentUser]);
    app.get(routePrefix + '/users/:id', [middleware.authorization, middleware.authToken, user.getById]);

    app.put(routePrefix + '/users', [middleware.authorization, middleware.authToken, user.update]);
    app.put(routePrefix + '/user', [middleware.authorization, middleware.authToken, user.update]);
    app.put(routePrefix + '/users/:id', [middleware.authorization, middleware.authToken, user.update]);

    app.post(routePrefix + '/users/:id/permissions', [middleware.authorization, middleware.authToken, user.updatePermission]);
    app.post(routePrefix + '/users', [middleware.authorization, middleware.authToken, user.create]);
    app.post(routePrefix + '/users/query', [middleware.authorization, middleware.authToken, user.query]);

    app.delete(routePrefix + '/users/:id', [middleware.authorization, middleware.authToken, user.deleteById]);
    app.delete(routePrefix + '/users/:id/permissions/:nodeid', [middleware.authorization, middleware.authToken, user.deletePermission]);

    return user;
};
