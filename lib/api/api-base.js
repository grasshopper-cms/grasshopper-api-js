module.exports = function(grasshopper) {
    "use strict";
    var base = {},
        CONTENT_TYPE = 'application/json';

    base.accessTokens = require('../entities/tokens')(grasshopper);

    base.AVAILABLE_PRIVILEGES = {
        ADMIN: 0,
        EDITOR: 1,
        AUTHOR: 2,
        READER: 3,
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
            case base.STATUS_CODES.SERVICE_UNAVAILABLE:
                message = "Service Unavailable";
                break;
            default:
                break;
        }

        return message;
    };

    base.getAuthenticationHeader = function(req, callback){
        var authHeader = req.headers['authorization'];

        if(authHeader){
            var token=authHeader.split(/\s+/).pop()||'',
                auth=new Buffer(token, 'base64').toString(),
                parts=auth.split(/:/),
                username=parts[0],
                password=parts[1];

            callback(null, {username: username, password: password});
        }
        else {
            callback(new Error("Authorization credentials not provided."));
        }
    };

    base.authenticateRequest = function(req, res, callback){
        base.getAuthenticationHeader(req, function(err, hdr){
            if(err){
                base.write(base.STATUS_CODES.UNAUTHORIZED, base.getStatusMessage(base.STATUS_CODES.UNAUTHORIZED), res);
            }
            else {
                //Use the token to look up user details and send back permissions to the caller.
                callback(null, {});
            }
        });
    };

    base.userCan = function(userObj, minPriviledge){
        return true;
    };

    /**
     *
     * @param responseCode
     * @param responseData
     * @param res
     */
    base.write = function(responseCode, responseData, res){
        res.writeHead(responseCode, { 'Content-Type': CONTENT_TYPE });
        res.write(responseData);
        res.end();
    };

    return base;
};
