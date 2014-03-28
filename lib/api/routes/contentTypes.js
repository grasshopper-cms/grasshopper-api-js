module.exports = function(app){
    "use strict";

    var contentTypes = {},
        Builder = require('../middleware/Builder'),
        ct = require("../../entities/contentTypes"),
        Response = require('bridgetown-api').Response,
        Request = require('../helpers/request'),
        routePrefix = (app.get('grasshopper route prefix')) ? app.get('grasshopper route prefix') : '',
        request = new Request();

    contentTypes.getById = function (httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(ct.getById(httpRequest.params.id));
    };

    contentTypes.deleteById = function(httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(ct.deleteById(httpRequest.params.id));
    };

    contentTypes.getList = function (httpRequest, httpResponse){
        var limit = request.getListPageSize(httpRequest),
            skip = request.getListSkipSize(httpRequest);

        new Response(httpResponse).writeFromPromise(ct.list({ limit: limit, skip: skip }));
    };

    contentTypes.create = function(httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(ct.create(httpRequest.body));
    };

    contentTypes.update = function(httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(ct.update(httpRequest.body));
    };

    app.get(routePrefix + '/contenttypes',
        new Builder()
            .secure(Builder.user.required.reader)
            .add(contentTypes.getList).middleware
    );

    app.get(routePrefix + '/contenttypes/:id',
        new Builder().secure(Builder.user.required.reader)
            .add(contentTypes.getById).middleware
    );

    app.delete(routePrefix + '/contenttypes/:id',
        new Builder()
            .secure(Builder.user.required.admin)
            .add(contentTypes.deleteById).middleware
    );

    app.put(routePrefix + '/contenttypes',
        new Builder()
            .secure(Builder.user.required.admin)
            .add(contentTypes.update).middleware
    );

    app.put(routePrefix + '/contenttypes/:id',
        new Builder()
            .secure(Builder.user.required.admin)
            .add(contentTypes.update).middleware
    );

    app.post(routePrefix + '/contenttypes',
        new Builder()
            .secure(Builder.user.required.admin)
            .add(contentTypes.create).middleware
    );

    return contentTypes;
};