(function(){
    "use strict";

    var api = {},
        content = require('../../entities/content'),
        Response = require('bridgetown-api').Response;

    api.getById = function (httpRequest, httpResponse){
        new Response(httpResponse).writeFromPromise(content.getById(httpRequest.params.id));
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

    module.exports = api;
})();