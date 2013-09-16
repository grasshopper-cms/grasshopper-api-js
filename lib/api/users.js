module.exports = function(grasshopper){
    "use strict";

    var user = {},
        base = require('./api-base')(grasshopper);

    user.getCurrentUser = function (req, res){
        base.authenticateRequest(req, res, function(token){
            var userId = token.profile._id;

            grasshopper.users.getById(userId, function(err, userObj){
                if(err){
                    base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                }
                else {
                    base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(userObj), res);
                }
            });
        });
    };

    user.getById = function (req, res){
        base.authenticateRequest(req, res, function(token){
            if(base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN)) {
                grasshopper.users.getById(req.params.id, function(err, userObj){
                    if(err){
                        if(err.message.indexOf('[404]') > -1){
                            base.write(base.STATUS_CODES.NOT_FOUND, JSON.stringify(err), res);
                        }
                        else {
                            base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                        }
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(userObj), res);
                    }
                });
            }
            else {
                base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
            }
        });
    };

    user.getList = function (req, res){
        base.authenticateRequest(req, res, function(token){
            var limit = base.getListPageSize(req),
                skip = base.getListSkipSize(req);

            if(base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN)) {
                grasshopper.users.list({
                    limit: limit,
                    skip: skip
                }, function(err, userList){
                    if(err){
                        base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(userList), res);
                    }
                });
            }
        });
    };

    user.describe = function (req, res){
        base.authenticateRequest(req, res, function(token){

            if(base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN)) {
                grasshopper.users.describe(function(err, userData){
                    if(err){
                        base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(userData), res);
                    }
                });
            }
        });
    };

    return user;
};