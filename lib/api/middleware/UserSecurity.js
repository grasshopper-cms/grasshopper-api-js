/**
 * Every api method and call can be protected by setting a minimum permission level on it. These lookup values
 * are used to ensure readers don't update user accounts, etc.
 *
 *  {{ADMIN: number, EDITOR: number, AUTHOR: number, READER: number, NONE: number}}
 */
module.exports = function() {
    "use strict";

    var Strings = require('../../strings'),
        Response = require('bridgetown-api').Response,
        privileges = require('../../entities/permissions/privileges'),
        permissions = require('../../entities/permissions/global'),
        strings = new Strings('en');

    function handleResponse(isValid, httpResponse, next){
        var response = new Response(httpResponse),
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
        var isValid = permissions.allowed(httpRequest.bridgetown.identity.role, permissionLevel);
        handleResponse(isValid, httpResponse, next);
    }

    this.requireAdmin = function(httpRequest, httpResponse, next){
        validateUserHandleResponse(privileges.available.ADMIN, httpRequest, httpResponse, next);
    };

    this.requireAdminOrSelf = function(httpRequest, httpResponse, next){
        var isValid = permissions.allowed(httpRequest.bridgetown.identity.role, privileges.available.ADMIN),
            userid = "";

        //User doen't have base permissions see if they are themselves.
        if(!isValid){
            //Do an extra check if both the body and :id are set and make sure they match. If not fail it.
            if((httpRequest.body._id && httpRequest.params.id) && (httpRequest.body._id.toString() != httpRequest.params.id)){
                isValid = false;
            }
            else {
                userid = (httpRequest.body._id) ? httpRequest.body._id.toString() : httpRequest.params.id;

                //This check handles the case if the base privileges aren't enough but the user is trying to take action on itself
                if(userid == httpRequest.bridgetown.identity._id.toString()){
                    isValid = true;
                }
            }
        }
        handleResponse(isValid, httpResponse, next);
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