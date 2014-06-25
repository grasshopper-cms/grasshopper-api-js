module.exports = function(router){
    'use strict';

    var user = {},
        bridgetown = require('bridgetown-api'),
        grasshopper = require('grasshopper-core'),
        middleware = bridgetown.middleware,
        Response = bridgetown.Response,
        Request = require('../utils/request'),
        routePrefix = (router.get('grasshopper route prefix')) ? router.get('grasshopper route prefix') : '',
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

    router.route('/user')
        .get([middleware.authorization, middleware.authToken, user.getCurrentUser])
        .put([middleware.authorization, middleware.authToken, user.update]);

    router.route('/users')
        .get([middleware.authorization, middleware.authToken, user.getList])
        .put([middleware.authorization, middleware.authToken, user.update])
        .post([middleware.authorization, middleware.authToken, user.create]);

    router.route('/users/:id')
        .get([middleware.authorization, middleware.authToken, user.getById])
        .put([middleware.authorization, middleware.authToken, user.update])
        .delete([middleware.authorization, middleware.authToken, user.deleteById]);

    router.post('/users/:id/permissions', [middleware.authorization, middleware.authToken, user.updatePermission]);
    router.delete('/users/:id/permissions/:nodeid', [middleware.authorization, middleware.authToken, user.deletePermission]);
    router.post('/users/query', [middleware.authorization, middleware.authToken, user.query]);




    return user;
};
