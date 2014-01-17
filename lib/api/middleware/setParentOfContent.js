module.exports = function(httpRequest, httpResponse, next){
    "use strict";
    var content = require('../../../entities/content');

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