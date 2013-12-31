module.exports = function(httpRequest, httpResponse, next){
    "use strict";
    var Strings = require('../../../strings'),
        Response = require('../../helpers/response'),
        content = require('../../../entities/content'),
        strings = new Strings('en'),
        _ = require("underscore"),
        response = new Response(httpResponse);


    function dehydrate(propname){

        if(_.isArray(httpRequest.body[propname])){
            var arr = _.map(httpRequest.body[propname], function(val){
                if(_.isObject(val)){
                    val = val._id;
                }

                return val;
            });

            httpRequest.body[propname] = arr;
        }
    }

    if(_.isObject(httpRequest.body.parent) && !_.isUndefined(httpRequest.body.parent._id)){
        httpRequest.body.parent = httpRequest.body.parent._id;
    }

    dehydrate("allowedTypes");
    dehydrate("ancestors");

    next();
};