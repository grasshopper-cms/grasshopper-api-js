module.exports = function(app){
    "use strict";

    var user = {},
        bridgetown = require('bridgetown-api'),
        middleware = bridgetown.middleware,
        Response = bridgetown.Response,
        Request = require('../helpers/request'),
        Builder = require('../middleware/Builder'),
        users = require('../../entities/users'),
        request = new Request();

    function writeApiResponse(httpResponse, promise){
        var response = new Response(httpResponse);
        response.writeFromPromise(promise);
    }

    user.getCurrentUser = function (httpRequest, httpResponse){
        var promise = users.getById(httpRequest.bridgetown.identity._id);
        writeApiResponse(httpResponse, promise);
    };

    user.getById = function (httpRequest, httpResponse){
        var promise = users.getById(httpRequest.params.id);
        writeApiResponse(httpResponse, promise);
    };

    user.deleteById = function(httpRequest, httpResponse){
        var promise = users.deleteById(httpRequest.params.id);
        writeApiResponse(httpResponse, promise);
    };

    user.getList = function (httpRequest, httpResponse){
        var limit = request.getListPageSize(httpRequest),
            skip = request.getListSkipSize(httpRequest),
            promise = users.list({ query: {}, limit: limit, skip: skip });

        writeApiResponse(httpResponse, promise);
    };

    user.update = function(httpRequest, httpResponse){
        var promise = users.update(httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    user.create = function(httpRequest, httpResponse){
        var promise = users.create(httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    user.updatePermission = function(httpRequest, httpResponse){
        var promise = users.updatePermission(httpRequest.params.id, httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    user.deletePermission = function(httpRequest, httpResponse){
        var promise = users.deletePermission(httpRequest.params.id, httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    user.query = function (httpRequest, httpResponse){
        var promise = users.query(httpRequest.body.filters,httpRequest.body.options);
        writeApiResponse(httpResponse, promise);
    };

    app.get('/users',
        new Builder()
            .secure(Builder.security.admin)
            .add(user.getList).middleware
    );

    app.get('/user',
        new Builder()
            .secure()
            .add(user.getCurrentUser).middleware
    );

    app.get('/users/:id',
        new Builder()
            .secure(Builder.security.admin)
            .add(user.getById).middleware
    );

    app.put('/users',
        new Builder()
            .secure(Builder.security.admin)
            .add(user.update).middleware
    );

    app.put('/user',
        new Builder()
            .secure(Builder.security.adminOrSelf)
            .add(user.update).middleware
    );

    app.put('/users/:id',
        new Builder()
            .secure(Builder.security.adminOrSelf)
            .add(user.update).middleware
    );

    app.post('/users/:id/permissions',
        new Builder()
            .secure(Builder.security.admin)
            .add(user.updatePermission).middleware
    );

    app.post('/users',
        new Builder()
            .secure(Builder.security.admin)
            .add(user.create).middleware
    );

    app.post('/users/query',
        new Builder()
            .secure(Builder.security.admin)
            .add(user.query).middleware
    );

    app.delete('/users/:id',
        new Builder()
            .secure(Builder.security.admin)
            .add(user.deleteById).middleware
    );

    app.delete('/users/:id/permissions/:nodeid',
        new Builder()
            .secure(Builder.security.admin)
            .add(user.deletePermission).middleware
    );

    return user;
};
