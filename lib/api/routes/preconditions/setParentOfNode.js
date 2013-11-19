module.exports = function(req, res, next){
    "use strict";
    var Strings = require('../../../strings'),
        Response = require('../../helpers/response'),
        strings = new Strings('en'),
        response = new Response()

    if(req.params.nodeid && req.params.nodeid !== ""){
        req.parent = req.params.nodeid;
    }
    else if(req.body.parent && req.body.parent !== ""){
        req.parent = req.body.parent;
    }

    next();
};