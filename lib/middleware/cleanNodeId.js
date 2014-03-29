module.exports = function(httpRequest, httpResponse, next){
    'use strict';

    if(httpRequest.params.nodeid && (httpRequest.params.nodeid === '' || httpRequest.params.nodeid.toString() === '0')){
        httpRequest.params.nodeid = null;
    }
    if(httpRequest.body.parent && (httpRequest.body.parent === '' || httpRequest.body.parent.toString() === '0')){
        httpRequest.body.parent = null;
    }

    next();
};