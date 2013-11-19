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

    var Strings = require('../../strings'),
        Response = require('../helpers/response'),
        tokens = require('../../entities/tokens'),
        users = require('../../entities/users'),
        strings = new Strings('en'),
        response = new Response();

    function onGetIdentity(err, identity){
        if(err){
            response.write(response.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
        }
        else {
            req.identity = identity;
            next();
        }
    }

    function onGetToken(err, token){
        if(err){
            response.write(response.STATUS_CODES.UNAUTHORIZED, JSON.stringify({ message: strings.http[response.STATUS_CODES.UNAUTHORIZED]}), res);
        }
        else {
            users.getById(token.profile._id, onGetIdentity);
        }
    }

    tokens.getById(req.token, onGetToken);
};