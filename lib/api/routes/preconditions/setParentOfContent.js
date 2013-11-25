module.exports = function(httpRequest, httpResponse, next){
    "use strict";
    var Strings = require('../../../strings'),
        Response = require('../../helpers/response'),
        content = require('../../../entities/content'),
        strings = new Strings('en'),
        response = new Response(httpResponse);

    function setByContentsParentNode(doc){
        if(doc.node && doc.node._id){
            httpRequest.parent = doc.node._id.toString();
        }
    }

    function setByBodyNode(){
        if(httpRequest.body.node && httpRequest.body.node._id){
            httpRequest.parent = httpRequest.body.node._id;
        }
    }

    function moveNext(){
        next();
    }

    content.getById(httpRequest.params.id).then(setByContentsParentNode).fail(setByBodyNode).done(moveNext);
};