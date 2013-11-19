/**
 * Every api method and call can be protected by setting a minimum permission level on it. These lookup values
 * are used to ensure readers don't update user accounts, etc.
 *
 *  {{ADMIN: number, EDITOR: number, AUTHOR: number, READER: number, NONE: number}}
 */
module.exports = function() {
    "use strict";

    var Strings = require('../../../strings'),
        Response = require('../../helpers/response'),
        privileges = require('../../../entities/permissions/privileges'),
        permissions = require('../../../entities/permissions/global'),
        strings = new Strings('en');

    function handleResponse(isValid, res, next){
        var response = new Response(res);

        if(!isValid){
            response.write(response.STATUS_CODES.FORBIDDEN, JSON.stringify({ message: strings.group('errors').user_privileges_exceeded}), res);
        }
        else {
            next();
        }
    }

    function validateUserHandleResponse(permissionLevel, req, res, next){
        var isValid = permissions.allowed(req.identity.role, permissionLevel);
        handleResponse(isValid, res, next);
    }

    this.requireAdmin = function(req, res, next){
        validateUserHandleResponse(privileges.available.ADMIN, req, res, next);
    };

    this.requireAdminOrSelf = function(req, res, next){
        var isValid = permissions.allowed(req.identity.role, privileges.available.ADMIN);

        //This check handles the case if the base privileges aren't enough but the user is trying to take action on itself
        if(!isValid && (req.body._id === req.identity._id) ){
            isValid = true;
        }

        handleResponse(isValid, res, next);
    };

    this.requireEditor = function(req, res, next){
        validateUserHandleResponse(privileges.available.EDITOR, req, res, next);
    };

    this.requireAuthor = function(req, res, next){
        validateUserHandleResponse(privileges.available.AUTHOR, req, res, next);
    };

    this.requireReader = function(req, res, next){
        validateUserHandleResponse(privileges.available.READER, req, res, next);
    };
};