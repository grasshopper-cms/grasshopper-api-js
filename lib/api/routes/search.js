(function(){
    "use strict";

    var api = {},
        search = require('../../entities/search'),
        Response = require('../helpers/response'),
        response = new Response();


    api.query = function (req, res){
        search.query(
            req.body.nodes,
            req.body.types,
            req.body.filters,
            req.body.options, response.writeCallback.bind(res));
    };

    module.exports = api;
})();