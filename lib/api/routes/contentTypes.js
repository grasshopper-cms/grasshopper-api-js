(function(){
    "use strict";

    var contentTypes = {},
        ct = require("../../entities/contentTypes"),
        Response = require('../helpers/response'),
        Request = require('../helpers/request'),
        response = new Response(),
        request = new Request();

    contentTypes.getById = function (req, res){
        ct.getById(req.params.id, response.writeCallback.bind(res));
    };

    contentTypes.deleteById = function(req, res){
        ct.deleteById(req.params.id, response.writeCallback.bind(res));
    };

    contentTypes.getList = function (req, res){
        var limit = request.getListPageSize(req),
            skip = request.getListSkipSize(req);

        ct.list({ limit: limit, skip: skip }, response.writeCallback.bind(res));
    };

    contentTypes.create = function(req, res){
        ct.create(req.body, response.writeCallback.bind(res));
    };

    contentTypes.update = function(req, res){
        ct.update(req.body, response.writeCallback.bind(res));
    };

    module.exports = contentTypes;
})();