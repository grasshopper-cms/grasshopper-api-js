(function(){
    "use strict";

    var contentTypes = {},
        ct = require("../entities/contentTypes"),
        base = require('./api-base');

    contentTypes.getById = function (req, res){
        base.authenticateRequest(req, res, function(token){
            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    ct.getById(req.params.id, function(err, obj){
                        if(err){
                            if(err.message.indexOf('[404]') > -1){
                                base.write(base.STATUS_CODES.NOT_FOUND, JSON.stringify(err), res);
                            }
                            else {
                                base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                            }
                        }
                        else {
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(obj), res);
                        }
                    });
                }
            });
        });
    };

    contentTypes.deleteById = function(req, res){
        base.authenticateRequest(req, res, function(token){
            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    ct.deleteById(req.params.id, function(err){
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

    contentTypes.getList = function (req, res){
        base.authenticateRequest(req, res, function(token){
            var limit = base.getListPageSize(req),
                skip = base.getListSkipSize(req);

            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    ct.list({
                        limit: limit,
                        skip: skip
                    }, function(err, list){
                        if(err){
                            base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                        }
                        else {
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(list), res);
                        }
                    });
                }
            });
        });
    };

    contentTypes.create = function(req, res){
        base.authenticateRequest(req, res, function(token){
            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else{
                    ct.create(req.body, function(err, userData){
                        if(err){
                            base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify({message: err.message}), res);
                        }
                        else {
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(userData), res);
                        }
                    });
                }
            });
        });
    };

    contentTypes.update = function(req, res){
        base.authenticateRequest(req, res, function(token){
            base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    ct.update(req.body, function(err, obj){
                        if(err){
                            base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify({message: err.message}), res);
                        }
                        else {
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(obj), res);
                        }
                    });
                }
            });
        });
    };

    module.exports = contentTypes;
})();