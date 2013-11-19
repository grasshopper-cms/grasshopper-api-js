(function(){
    "use strict";

    var Response = require('./helpers/response'),
        Request = require('./helpers/request'),
        user = {},
        users = require('../entities/users'),
        response = new Response(),
        request = new Request();


    user.getCurrentUser = function (req, res){
        users.getById(req.identity._id, response.writeCallback.bind(res));
    };

    user.getById = function (req, res){
        users.getById(req.params.id, response.writeCallback.bind(res));
    };

    user.deleteById = function(req, res){
        users.deleteById(req.params.id, response.writeCallback.bind(res));
    };

    user.getList = function (req, res){
        var limit = request.getListPageSize(req),
            skip = request.getListSkipSize(req);

        users.list({ query: {}, limit: limit, skip: skip }, response.writeCallback.bind(res));
    };

    user.update = function(req, res){
        users.update(req.body, response.writeCallback.bind(res));
    };

    user.create = function(req, res){
        users.create(req.body, response.writeCallback.bind(res));
    };

    user.updatePermission = function(req, res){
        users.updatePermission(req.params.id, req.body, response.writeCallback.bind(res));
    };

    user.deletePermission = function(req, res){
        users.deletePermission(req.params.id, req.params.nodeid, response.writeCallback.bind(res));
    };

    module.exports = user;
})();
