module.exports = function(httpRequest, httpResponse, next){
    "use strict";

    if(httpRequest.params.nodeid && (httpRequest.params.nodeid !== "" && httpRequest.params.nodeid.toString() !== "0")){
        httpRequest.parent = httpRequest.params.nodeid;
    }
    else if(httpRequest.body.parent && httpRequest.body.parent !== "" && httpRequest.body.parent !== "0"){
        httpRequest.parent = httpRequest.body.parent;
    }
    else {
        httpRequest.parent = null;
    }

    next();
};