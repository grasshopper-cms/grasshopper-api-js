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
        strings = new Strings('en');

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
     */
    token.get = function (httpRequest, httpResponse){
        var response = new Response(httpResponse);

        async.waterfall([
            function(next){
                parseHeader(httpRequest.token, function(err, creds){
                    next(err, creds.username, creds.password);
                });
            },
            function(userName, password, next){
                users.authenticate(userName, password)
                    .then(function(user){
                        next(null, user);
                    })
                    .fail(function(err){
                        next(err);
                    });
            },
            function(user, next){
                var t = uuid.v4();
                tokens.create(t, user)
                    .then(function(serverToken){
                        next(null, t);
                    });
            }],
            function(err, accessToken){
                if(err){
                    response.write(response.STATUS_CODES.UNAUTHORIZED, JSON.stringify({message: strings.group('http')[response.STATUS_CODES.UNAUTHORIZED]}));
                }
                else {
                    response.write(response.STATUS_CODES.SUCCESS, JSON.stringify({
                        "access_token": new Buffer(accessToken).toString('base64'),
                        "token_type": "Token"
                    }));
                }
            }
        );
    };

    token.getNew = function(httpRequest, httpResponse){
        var t = uuid.v4(),
            response = new Response(httpResponse);

        tokens.create(t, httpRequest.identity).then(function(accessToken){
            var token = {
                "access_token": new Buffer(t).toString('base64'),
                "token_type": "Token"
            };

            response.write(response.STATUS_CODES.SUCCESS, JSON.stringify(token));
        });
    };

    module.exports = token;
})();