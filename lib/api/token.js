module.exports = function(grasshopper){
    "use strict";

    var token = {},
        uuid = require('node-uuid'),
        base = require("./api-base")(grasshopper);

    token.get = function (req, res){
        base.getAuthenticationHeader(req , function(err, creds){
            if(err){
                base.write(base.STATUS_CODES.UNAUTHORIZED, base.getStatusMessage(base.STATUS_CODES.UNAUTHORIZED), res);
            }
            else {
                grasshopper.users.getByLogin(creds.username, function(err, user){
                    if(err){
                        base.write(base.STATUS_CODES.UNAUTHORIZED, base.getStatusMessage(base.STATUS_CODES.UNAUTHORIZED), res);
                    }
                    else {
                        if(user.password == creds.password){
                            var t = uuid.v4();

                            base.accessTokens.create(t, user);
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify({
                                "access_token": t,
                                "token_type": "Token"
                            }),res);
                        }
                        else {
                            //Password does not match throw err.
                            base.write(base.STATUS_CODES.UNAUTHORIZED, base.getStatusMessage(base.STATUS_CODES.UNAUTHORIZED), res);
                        }
                    }

                });
            }
        });
    };

    return token;
};