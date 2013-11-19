module.exports = function(req, res, next){
    "use strict";
    var Strings = require('../../../strings'),
        Response = require('../../helpers/response'),
        content = require('../../../entities/content'),
        strings = new Strings('en'),
        response = new Response()

    function onGetContent(err, doc){
        if(err){
            response.write(response.STATUS_CODES.NOT_FOUND, JSON.stringify(err), res);
        }
        else {
            if(doc.node && doc.node._id){
                req.parent = doc.node._id.toString();
            }

            next();
        }
    }

    content.getById(req.params.id, onGetContent);
};