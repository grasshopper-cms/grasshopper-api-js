module.exports = function(grasshopper){
    "use strict";

    var contentTypes = {},
        base = require('./api-base')(grasshopper);

    contentTypes.getById = function (req, res){

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
        });
    };

    contentTypes.create = function(req, res){

    };

    return contentTypes;
};