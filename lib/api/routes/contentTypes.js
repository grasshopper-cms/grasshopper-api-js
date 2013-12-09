(function(){
    "use strict";

    var contentTypes = {},
        ct = require("../../entities/contentTypes"),
        Response = require('../helpers/response'),
        Request = require('../helpers/request'),
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

    module.exports = contentTypes;
})();