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
        tokens = require('../../../entities/tokens'),
        users = require('../../../entities/users'),
        strings = new Strings('en'),
        response = new Response(httpResponse);

    function setIdentity(identity){
        httpRequest.identity = identity;
        next();
    }

    function parseToken(token){
        users.getById(token.uid).then(setIdentity).fail(setError);
    }

    function setError(err){
        response.write(response.STATUS_CODES.SERVER_ERROR, JSON.stringify(err));
    }

    function setUnauthorized(err){
        response.write(response.STATUS_CODES.UNAUTHORIZED, JSON.stringify({ message: strings.group('http')[response.STATUS_CODES.UNAUTHORIZED]}));
    }

    tokens.getById(httpRequest.token).then(parseToken).fail(setUnauthorized);
};