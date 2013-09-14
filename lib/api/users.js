module.exports = function(grasshopper){
    "use strict";

    var user = {},
        base = require('./api-base')(grasshopper);

    user.getById = function (req, res){
        base.authenticateRequest(req, res, function(err, token){

            //base.userCan();
            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(token), res);
        });
    };

    return user;
};
/*
module.exports = function(grasshopper){
    "use strict";

    var token = {},


    token.get = function (req, res){
        validate(req , function(err, creds){
            if(err){
                res.writeHead(STATUS_CODE_UNAUTHORIZED, { 'Content-Type': CONTENT_TYPE });
                res.write(UNAUTHORIZED_EXCEPTION_MESSAGE);
                res.end();
            }
            else {
                grasshopper.users.getByLogin(creds.username, function(err, user){
                    if(err){
                        res.writeHead(404, { 'Content-Type': CONTENT_TYPE });
                        res.write(UNAUTHORIZED_EXCEPTION_MESSAGE);
                    }
                    else {
                        if(user.password == creds.password){
                            res.writeHead(STATUS_CODE_SUCCESS, { 'Content-Type': CONTENT_TYPE });
                            var t = uuid.v4();

                            cachedTokens.create(t, user);

                            res.write(JSON.stringify({
                                "access_token": t,
                                "token_type": "Token"
                            }));
                        }
                        else {
                            //Password does not match throw err.
                            res.writeHead(STATUS_CODE_UNAUTHORIZED, { 'Content-Type': CONTENT_TYPE });
                            res.write(UNAUTHORIZED_EXCEPTION_MESSAGE);
                        }
                    }
                    res.end();
                });
            }
        });
    };

    return token;
};*/