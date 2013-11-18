(function(){
    "use strict";

    var Response = require('./helpers/response'),
        api = {},
        content = require('../entities/content'),
        response = new Response();


    api.getById = function (req, res){
        content.getById(req.params.id, response.writeCallback.bind(res));
    };

    api.deleteById = function(req, res){
        content.deleteById(req.params.id, response.writeCallback.bind(res));
    };

    api.update = function(req, res){
        content.update(req.body, response.writeCallback.bind(res));
    };

    api.create = function(req, res){
        content.create(req.body, response.writeCallback.bind(res));
    };

    module.exports = api;
})();