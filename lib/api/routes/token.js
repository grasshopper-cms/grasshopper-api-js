/**
 * The token api module is responsible for creating an access token to use the API.
 */
(function(){
    "use strict";

    var token = {},
        uuid  = require('node-uuid'),
        async = require('async'),
        Response = require('../helpers/response'),
        Strings = require('../../strings'),
        tokens= require('../../entities/tokens'),
        users = require("../../entities/users"),
        strings = new Strings('en'),
        response = new Response();
    /**
     * Method will pull out the username and password out of the auth header.
     * @param authHeader String found in the HTTP authentication header.
     * @param callback
     */
    function parseHeader(authHeader, callback){
        try {
            var parts=authHeader.split(/:/),
                username=parts[0],
                password=parts[1];

            callback(null, {username: username, password: password});
        }
        catch(ex){
            callback(ex);
        }
    }

    /**
     *  Sequence to generate a token should be: (All need to succeed to be valid)
     *  1) Get the auth token header
     *  2) Pull out the username and password from header.
     *  3) Get the user with the username passed in.
     *  4) Validate the password to make sure it matches
     *  5) Create the token.
     * @param req Request
     * @param res Response
     */
    token.get = function (req, res){
        async.waterfall([
            function(callback){
                parseHeader(req.token, function(err, creds){
                    callback(err, creds.username, creds.password);
                });
            },
            function(userName, password, callback){
                users.authenticate(userName, password, function(err, user){
                    callback(err, user);
                });
            },
            function(user, callback){
                var t = uuid.v4();
                tokens.create(t, user, function(err, serverToken){
                    callback(null, t);
                });

            }],
            function(err, accessToken){
                if(err){
                    response.write(response.STATUS_CODES.UNAUTHORIZED, JSON.stringify({message: strings.group('http')[response.STATUS_CODES.UNAUTHORIZED]}), res);
                }
                else {
                    response.write(response.STATUS_CODES.SUCCESS, JSON.stringify({
                        "access_token": new Buffer(accessToken).toString('base64'),
                        "token_type": "Token"
                    }),res);
                }
            }
        );
    };

    module.exports = token;
})();