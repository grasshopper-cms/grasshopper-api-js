module.exports = function(router){
    'use strict';

    var contentTypes = {},
        grasshopper = require('grasshopper-core'),
        bridgetown = require('bridgetown-api'),
        Response = bridgetown.Response,
        middleware = bridgetown.middleware,
        Request = require('../utils/request'),
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

    contentTypes.query = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).contentTypes.query(httpRequest.body);
        new Response(httpResponse).writeFromPromise(promise);
    };
    
    contentTypes.getBySlug = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).contentTypes
            .query({
                filters:{
                    key: 'slug',
                    cmp: '=',
                    value: httpRequest.params.slug
                }
            });
        new Response(httpResponse).writeFromPromise(promise);
    };

    router.route('/contenttypes')
        .get([middleware.authorization, middleware.authToken, contentTypes.getList])
        .put([middleware.authorization, middleware.authToken, contentTypes.update])
        .post([middleware.authorization, middleware.authToken, contentTypes.insert]);

    router.route('/contenttypes/:id')
        .get([middleware.authorization, middleware.authToken, contentTypes.getById])
        .delete([middleware.authorization, middleware.authToken, contentTypes.deleteById])
        .put([middleware.authorization, middleware.authToken, contentTypes.update]);

    router.route('/contenttypes/slug/:slug')
        .get([middleware.authorization, middleware.authToken, contentTypes.getBySlug]);

    router.post('/contenttypes/query', [middleware.authorization, middleware.authToken, contentTypes.query]);

    return contentTypes;
};