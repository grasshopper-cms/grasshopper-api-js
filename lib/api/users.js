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
            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
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
            });
        });
    };

    user.deleteById = function(req, res){
        base.authenticateRequest(req, res, function(token){
            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    grasshopper.users.deleteById(req.params.id, function(err){
                        if(err){
                            base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                        }
                        else {
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify({}), res);
                        }
                    });
                }
            });
        });
    };

    user.getList = function (req, res){
        base.authenticateRequest(req, res, function(token){
            var limit = base.getListPageSize(req),
                skip = base.getListSkipSize(req);

            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    grasshopper.users.list({
                        query: {},
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
        });
    };

    user.describe = function (req, res){
        base.authenticateRequest(req, res, function(token){
            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
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
        });
    };

    user.update = function(req, res){
        base.authenticateRequest(req, res, function(token){
            //Perform update if the user is an admin or the user is updating themselves.
            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN,function(err){

                //If the user doesn't have permissions and it is not the current user.
                if(err && (req.body._id != token.profile._id) ){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    grasshopper.users.update(req.body, function(err, userObj){
                        if(err){
                            base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify({message: err.message}), res);
                        }
                        else {
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(userObj), res);
                        }
                    });
                }
            });

        });
    };

    user.create = function(req, res){
        base.authenticateRequest(req, res, function(token){
            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    grasshopper.users.create(req.body, function(err, userData){
                        if(err){
                            base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify({message: err.message}), res);
                        }
                        else {
                            delete userData.password;
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(userData), res);
                        }
                    });
                }
            });
        });
    };

    return user;
};