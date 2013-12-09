(function(){
    "use strict";

    var user = {},
        Response = require('../helpers/response'),
        Request = require('../helpers/request'),
        users = require('../../entities/users'),
        request = new Request();

    function writeApiResponse(httpResponse, promise){
        var response = new Response(httpResponse);
        response.writeFromPromise(promise);
    }

    user.getCurrentUser = function (httpRequest, httpResponse){
        var promise = users.getById(httpRequest.identity._id);
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

    module.exports = user;
})();
