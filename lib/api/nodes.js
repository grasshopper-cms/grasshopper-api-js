module.exports = function(grasshopper){
    "use strict";

    var node = {},
        async = require('async'),
        _ = require('underscore'),
        base = require('./api-base')(grasshopper);


    function userCanForNode(user, parentNodeId, minRole, callback){
        var isAllowed = _.find(user.permissions, function(permission){
            var userPrivLevel = base.AVAILABLE_PRIVILEGES[permission.role.toUpperCase()];
            return (permission.nodeid == parentNodeId &&  (userPrivLevel <= parseInt(minRole, 10)));
        });

        callback((!isAllowed) ? new Error("User does not have enough privileges.") : null);
    }

    function userPreventedForNode(user, parentNodeId, minRole, callback){
        var ruleIsSet = false,
            isAllowed = _.find(user.permissions, function(permission){
                var userPrivLevel = base.AVAILABLE_PRIVILEGES[permission.role.toUpperCase()];
                ruleIsSet = true;

                return (permission.nodeid == parentNodeId &&  (userPrivLevel <= parseInt(minRole, 10)));
            });

        callback((ruleIsSet && !isAllowed) ? new Error("User does not have enough privileges.") : null);
    }

    function userCan(token, minRole, parentNodeId, callback){

        async.waterfall([
            function(cb){
                grasshopper.users.getById(token.profile._id, function(err, obj){
                    var permissions = {
                        userPermission: false,
                        nodePermission: false,
                        nodeRestriction: true
                    };

                   cb(null, obj, permissions);
                });
            },
            function(user, permissions, cb){
                userCanForNode(user, parentNodeId, minRole, function(err){
                   permissions.nodePermission = (err == null);
                   cb(null, user, permissions);
                });
            },
            function(user, permissions, cb){
                userPreventedForNode(user, parentNodeId, minRole, function(err){
                    permissions.nodeRestriction = (err != null);
                    cb(null, user, permissions);
                });
            },
            function(user, permissions, cb){
                base.userCan(token, minRole, function(err){
                    permissions.userPermission = (err == null);
                    cb(null, user, permissions);
                });
            }
        ], function(err, user, permissions){
            var error = ((permissions.userPermission && !permissions.nodeRestriction) || permissions.nodePermission) ? null : new Error("User does not have  rights to perform this action.");
            callback(error);
        });
    }


     node.getById = function (req, res){
        base.authenticateRequest(req, res, function(token){

            userCan(token, base.AVAILABLE_PRIVILEGES.READER, req.params.node, function(err){

                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    grasshopper.nodes.getById(req.params.node, function(err, userObj){
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

     node.deleteById = function(req, res){
        base.authenticateRequest(req, res, function(token){

            base.userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    grasshopper.nodes.deleteById(req.params.id, function(err){
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

    node.getChildNodes = function(req, res){
        //[TODO]
    };

    node.getFiles = function(req, res){
        //[TODO]
    };

    node.getFilesDeepLoad = function(req, res){
        //[TODO]
    };

    node.getChildNodesDeepLoad = function(req, res){
        //[TODO]
    };

     node.describe = function (req, res){
        base.authenticateRequest(req, res, function(token){

            base.userCan(token, base.AVAILABLE_PRIVILEGES.READER, function(err){

                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    grasshopper.nodes.describe(function(err, obj){
                        if(err){
                            base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                        }
                        else {
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(obj), res);
                        }
                    });
                }
            });
        });
    };

     node.update = function(req, res){
        base.authenticateRequest(req, res, function(token){

            userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, req.param.body._id, function(err) {

                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {

                    grasshopper.nodes.update(req.body, function(err, obj){
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

    node.create = function(req, res){
        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, req.body.parent, function(err) {
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    grasshopper.nodes.create(req.body, function(err, obj){
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

    return node;
};