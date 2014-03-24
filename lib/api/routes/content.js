module.exports = function(app){
    "use strict";

    var api = {},
        Builder = require('../middleware/Builder'),
        setParentOfContent = require('../middleware/setParentOfContent'),
        content = require('../../entities/content'),
        routePrefix = (app.get('grasshopper route prefix')) ? app.get('grasshopper route prefix') : '',
        Response = require('bridgetown-api').Response;

    console.log('routePrefix', routePrefix);
    api.getById = function (httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(content.getById(httpRequest.params.id));
    };

    api.getBySlug = function (httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(content.getBySlug(httpRequest.params.id));
    };

    api.deleteById = function(httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(content.deleteById(httpRequest.params.id));
    };

    api.update = function(httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(content.update(httpRequest.body));
    };

    api.create = function(httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(content.create(httpRequest.body));
    };

    api.query = function (httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(
            content.query(
                httpRequest.body.nodes,
                httpRequest.body.types,
                httpRequest.body.filters,
                httpRequest.body.options)
        );
    };

    app.post(routePrefix + '/content',
        new Builder()
            .secure()
            .add(setParentOfContent)
            .add(Builder.node.required.author)
            .add(api.create).middleware
    );

    app.post(routePrefix + '/content/query',
        new Builder()
            .secure(Builder.node.required.reader)
            .add(api.query).middleware
    );

    app.put(routePrefix + '/content/:id',
        new Builder()
            .secure()
            .add(setParentOfContent)
            .add(Builder.node.required.author)
            .add(api.update).middleware
    );

    app.get(routePrefix + '/content/slug/:id',
        new Builder()
            .secure()
            .add(setParentOfContent)
            .add(Builder.node.required.reader)
            .add(api.getBySlug).middleware
    );

    app.get(routePrefix + '/content/:id',
        new Builder()
            .secure()
            .add(setParentOfContent)
            .add(Builder.node.required.reader)
            .add(api.getById).middleware
    );

    app.del(routePrefix + '/content/:id',
        new Builder()
            .secure()
            .add(setParentOfContent)
            .add(Builder.node.required.author)
            .add(api.deleteById).middleware
    );

    return api;
};