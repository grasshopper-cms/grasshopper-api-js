(function(){
    "use strict";

    var api = {},
        content = require('../../entities/content'),
        Response = require('../helpers/response'),
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