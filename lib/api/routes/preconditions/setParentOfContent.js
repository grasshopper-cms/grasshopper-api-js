module.exports = function(req, res, next){
    "use strict";
    var Strings = require('../../../strings'),
        Response = require('../../helpers/response'),
        content = require('../../../entities/content'),
        strings = new Strings('en'),
        response = new Response()

    function onGetContent(err, doc){
        if(err){
            if(req.body.node && req.body.node._id){
                req.parent = req.body.node._id;
            }
        }
        else {
            if(doc.node && doc.node._id){
                req.parent = doc.node._id.toString();
            }
        }

        next();
    }

    content.getById(req.params.id, onGetContent);
};