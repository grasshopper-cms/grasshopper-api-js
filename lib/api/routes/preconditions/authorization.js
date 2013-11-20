/**
 * The authenticate module is responsible to getting the authorization header from the request and attaching
 * the token to the request. If the credentials are not supplied then the request should fail and not proceed
 * any further.
 *
 * @param req HTTP Request
 * @param res HTTP Response
 * @param next Callback
 */
module.exports = function(req, res, next){
    "use strict";

    var Strings = require('../../../strings'),
        Response = require('../../helpers/response'),
        strings = new Strings('en'),
        response = new Response(),
        authHeader = req.headers['authorization'];

    if(authHeader){
        var token = authHeader.split(/\s+/).pop()||'';
        req.token = new Buffer(token, 'base64').toString();

        next();
    }
    else {
        response.write(response.STATUS_CODES.UNAUTHORIZED, JSON.stringify({message: strings.group('errors').missing_credentials}), res);
    }
};