module.exports = function(grasshopper){
    "use strict";

    var contentTypes = {},
        base = require('./api-base')(grasshopper);

    contentTypes.getById = function (req, res){
        base.authenticateRequest(req, res, function(token){
            if(base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN)) {
                grasshopper.contentTypes.getById(req.params.id, function(err, obj){
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
            else {
                base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
            }
        });
    };

    contentTypes.deleteById = function(req, res){
        base.authenticateRequest(req, res, function(token){
            if(base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN)) {
                grasshopper.contentTypes.deleteById(req.params.id, function(err){
                    if(err){
                        base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify({}), res);
                    }
                });
            }
            else {
                base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
            }
        });
    };

    contentTypes.getList = function (req, res){
        base.authenticateRequest(req, res, function(token){
            var limit = base.getListPageSize(req),
                skip = base.getListSkipSize(req);

            if(base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN)) {
                grasshopper.contentTypes.list({
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
            else {
                base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
            }
        });
    };

    contentTypes.create = function(req, res){
        base.authenticateRequest(req, res, function(token){
            if(base.userCan(token, base.AVAILABLE_PRIVILEGES.ADMIN)) {
                grasshopper.contentTypes.create(req.body, function(err, userData){
                    if(err){
                        base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify({message: err.message}), res);
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(userData), res);
                    }
                });
            }
            else {
                base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
            }
        });
    };

    return contentTypes;
};