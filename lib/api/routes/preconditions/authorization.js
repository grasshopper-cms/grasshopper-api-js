/**
 * The authenticate module is responsible to getting the authorization header from the request and attaching
 * the token to the request. If the credentials are not supplied then the request should fail and not proceed
 * any further.
 *
 */
module.exports = function(httpRequest, httpResponse, next){
    "use strict";

    var Strings = require('../../../strings'),
        Response = require('../../helpers/response'),
        strings = new Strings('en'),
        response = new Response(httpResponse),
        authHeader = httpRequest.headers['authorization'];

    if(authHeader){
        var token = authHeader.split(/\s+/).pop()||'';
        httpRequest.token = new Buffer(token, 'base64').toString();

        next();
    }
    else {
        response.write(response.STATUS_CODES.UNAUTHORIZED, JSON.stringify({message: strings.group('errors').missing_credentials}));
    }
};