/**
 * The token api module is responsible for creating an access token to use the API.
 */
module.exports = function(grasshopper){
    "use strict";

    var token = {},
        base  = require('./api-base')(grasshopper),
        uuid  = require('node-uuid'),
        async = require('async');

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
                base.getAuthenticationHeader(req , function(err, authHeader){
                    callback(err, authHeader);
                });
            },
            function(authHeader, callback){
                parseHeader(authHeader, function(err, creds){
                    callback(err, creds.username, creds.password);
                });
            },
            function(userName, password, callback){
                grasshopper.users.getByLogin(userName, function(err, user){
                    if(err){
                        callback(err);
                    }
                    else if(password != user.password){
                        callback(new Error(base.getStatusMessage(base.STATUS_CODES.UNAUTHORIZED)));
                    }
                    else {
                        callback(null, user);
                    }
                });
            },
            function(user, callback){
                var t = uuid.v4();
                base.accessTokens.create(t, user);
                callback(null, t);
            }],
            function(err, accessToken){
                if(err){
                    base.write(base.STATUS_CODES.UNAUTHORIZED, base.getStatusMessage(base.STATUS_CODES.UNAUTHORIZED), res);
                }
                else {
                    base.write(base.STATUS_CODES.SUCCESS, JSON.stringify({
                        "access_token": accessToken,
                        "token_type": "Token"
                    }),res);
                }
            }
        );
    };

    return token;
};