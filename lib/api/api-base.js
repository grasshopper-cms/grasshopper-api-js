(function() {
    "use strict";
    var base = {},
        tokens = require('../entities/tokens'),
        CONTENT_TYPE = 'application/json';

    function is_int(value){
        if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
            return true;
        } else {
            return false;
        }
    }

    base.DEFAULT ={
        PAGE_SIZE: 20,
        PAGE_SKIP_SIZE: 0
    };

    /**
     * Every api method and call can be protected by setting a minimum permission level on it. These lookup values
     * are used to ensure readers don't update user accounts, etc.
     *
     * @type {{ADMIN: number, EDITOR: number, AUTHOR: number, READER: number, NONE: number}}
     */
    base.AVAILABLE_PRIVILEGES = {
        ADMIN: 0,
        EDITOR: 1,
        AUTHOR: 2,
        READER: 3,
        EXTERNAL: 3,
        NONE: 4
    };

    /*
     Explanation of status codes used by the Grasshoper API:
     =============================================
     200: The request has succeeded.
     400: The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.
     401: The request requires user authentication. The response MUST include a WWW-Authenticate header field containing a challenge applicable to the requested resource. The client MAY repeat the request with a suitable Authorization header field. If the request already included Authorization credentials, then the 401 response indicates that authorization has been refused for those credentials.
     403: The server understood the request, but is refusing to fulfill it. Authorization will not help and the request SHOULD NOT be repeated. If the request method was not HEAD and the server wishes to make public why the request has not been fulfilled, it SHOULD describe the reason for the refusal in the entity. If the server does not wish to make this information available to the client, the status code 404 (Not Found) can be used instead.
     404: The server has not found anything matching the Request-URI. This status code is commonly used when the server does not wish to reveal exactly why the request has been refused, or when no other response is applicable.
     408: The client did not produce a request within the time that the server was prepared to wait.
     500: The server encountered an unexpected condition which prevented it from fulfilling the request.
     502: The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.
     503: The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.
     */
    base.STATUS_CODES = {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        REQUEST_TIMEOUT: 408,
        SERVER_ERROR: 500,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503
    };

    /**
     * Simple lookup method to return back the status strings that relate to an error code.
     * @param code
     * @returns {string}
     */
    base.getStatusMessage = function(code){
        var message = "";

        switch(code){
            case base.STATUS_CODES.SUCCESS:
                message = "Success";
                break;
            case base.STATUS_CODES.BAD_REQUEST:
                message = "Bad Request";
                break;
            case base.STATUS_CODES.UNAUTHORIZED:
                message = "Unauthorized";
                break;
            case base.STATUS_CODES.NOT_FOUND:
                message = "Not found";
                break;
            case base.STATUS_CODES.REQUEST_TIMEOUT:
                message = "Request Timeout";
                break;
            case base.STATUS_CODES.SERVER_ERROR:
                message = "Server Error";
                break;
            case base.STATUS_CODES.BAD_GATEWAY:
                message = "Bad Gateway";
                break;
            case base.STATUS_CODES.FORBIDDEN:
                message = "You are not authorized to view this content.";
                break;
            case base.STATUS_CODES.SERVICE_UNAVAILABLE:
                message = "Service Unavailable";
                break;
            default:
                break;
        }

        return message;
    };

    /**
     * Method will inspect a request that comes into the api and pull out the request authentication hearder if it
     * exists. If it does not exist then an error should be returned.
     * @param req
     * @param callback
     */
    base.getAuthenticationHeader = function(req, callback){
        var authHeader = req.headers['authorization'];

        if(authHeader){
            var token=authHeader.split(/\s+/).pop()||'',
                auth=new Buffer(token, 'base64').toString();

            callback(null, auth);
        }
        else {
            callback(new Error("Authorization credentials not provided."));
        }
    };

    /**
     * Method will evaluate the authentication header and see if it matches a token that is already being used in the
     * system. If it does not exist or the token is no longer valid it will send back send back a 401.
     * @param req
     * @param res
     * @param callback
     */
    base.authenticateRequest = function(req, res, callback){
        base.getAuthenticationHeader(req, function(err, hdr){
            if(err){
                base.write(base.STATUS_CODES.UNAUTHORIZED, base.getStatusMessage(base.STATUS_CODES.UNAUTHORIZED), res);
            }
            else {
                //Use the token to look up user details and send back permissions to the caller.
                tokens.getById(hdr,function(err, token){
                    if(err){
                        base.write(base.STATUS_CODES.UNAUTHORIZED, base.getStatusMessage(base.STATUS_CODES.UNAUTHORIZED), res);
                    }
                    else {
                        callback(token);
                    }
                });
            }
        });
    };

    /**
     * Method should evaluate a current user's privileges and determine if the user can do something in the system.
     * @param userObj
     * @param minPriviledge
     * @returns {boolean}
     */
    base.userCan = function(userObj, minPriviledge, callback){
        var userPrivLevel = base.AVAILABLE_PRIVILEGES[userObj.profile.role.toUpperCase()],
            err = (userPrivLevel <= parseInt(minPriviledge, 10)) ? null : new Error("User does not have enough privileges.");

        callback(err);
    };

    base.getListPageSize = function (req){
        return (req.query.limit != null && is_int(req.query.limit)) ? req.query.limit : base.DEFAULT.PAGE_SIZE;
    };

    base.getListSkipSize = function (req){
        return (req.query.skip != null && is_int(req.query.skip)) ? req.query.skip : base.DEFAULT.PAGE_SKIP_SIZE;
    };

    /**
     * Utility method that will write the response to the client.
     * @param responseCode HTTP status code
     * @param responseData JSON object response.
     * @param res
     */
    base.write = function(responseCode, responseData, res){
        res.writeHead(responseCode, { 'Content-Type': CONTENT_TYPE });
        res.write(responseData);
        res.end();
    };

    module.exports = base;
})();
