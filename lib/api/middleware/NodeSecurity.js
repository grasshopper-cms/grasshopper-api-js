

module.exports = function() {
    "use strict";

    var Strings = require('../../strings'),
        Response = require('bridgetown-api').Response,
        permissions = require('../../entities/permissions/global'),
        nodePermissions = require('../../entities/permissions/node'),
        privileges = require('../../entities/permissions/privileges'),
        strings = new Strings('en');

    function handleResponse(isValid, res, next){
        var response = new Response(res),
            err;

        if(!isValid){
            err = new Error(strings.group('errors').user_privileges_exceeded);
            err.errorCode = Response.statusCodes.forbidden;
            response.writeError(err);
        }
        else {
            next();
        }
    }

    function validateUserHandleResponse(permissionLevel, httpRequest, httpResponse, next){
        var isValid = nodePermissions.allowed(httpRequest.parent, httpRequest.bridgetown.identity.role, httpRequest.bridgetown.identity.permissions, permissionLevel);
        handleResponse(isValid, httpResponse, next);
    }

    this.requireAdmin = function(httpRequest, httpResponse, next){
        validateUserHandleResponse(privileges.available.ADMIN, httpRequest, httpResponse, next);
    };

    this.requireEditor = function(httpRequest, httpResponse, next){
        validateUserHandleResponse(privileges.available.EDITOR, httpRequest, httpResponse, next);
    };

    this.requireAuthor = function(httpRequest, httpResponse, next){
        validateUserHandleResponse(privileges.available.AUTHOR, httpRequest, httpResponse, next);
    };

    this.requireReader = function(httpRequest, httpResponse, next){
        validateUserHandleResponse(privileges.available.READER, httpRequest, httpResponse, next);
    };
};