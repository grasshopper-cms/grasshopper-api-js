module.exports = function(grasshopper){
    "use strict";

    var token = {},
        uuid = require('node-uuid'),
        cachedTokens = require('../entities/tokens')(grasshopper),
        CONTENT_TYPE = 'application/json',
        UNAUTHORIZED_EXCEPTION_MESSAGE = "Unauthorized.",
        STATUS_CODE_SUCCESS = 200,
        STATUS_CODE_UNAUTHORIZED = 401;


    function validate(req, callback){
        var authHeader=req.headers['authorization'];

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
    }

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
};