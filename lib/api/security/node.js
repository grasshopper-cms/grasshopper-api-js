

module.exports = function() {
    "use strict";

    var Strings = require('../../strings'),
        Response = require('../helpers/response'),
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

    function validateUserHandleResponse(permissionLevel, req, res, next){
        var isValid = nodePermissions.allowed(req.parent, req.identity.role, req.identity.permissions, permissionLevel);
        handleResponse(isValid, res, next);
    }

    this.requireAdmin = function(req, res, next){
        validateUserHandleResponse(privileges.available.ADMIN, req, res, next);
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