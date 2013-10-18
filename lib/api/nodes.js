module.exports = function(grasshopper){
    "use strict";

    var node = {},
        base = require('./api-base')(grasshopper);


    function userCanForNode(token, parentNodeId, minRole){
        //[TODO] This needs to validate the user's permissions for the node
        return true;
    }

    function userPreventedForNode(token, parentNodeId, minRole){
        //[TODO] This needs to make sure the user has not been restricted from performing an operation on this node.
        return false;
    }

    function userCan(token, minRole, parentNodeId, callback){
        //var err =  ((base.userCan(token, minRole) && !userPreventedForNode(token, parentNodeId, minRole)) || userCanForNode(parentNodeId, minRole)) ? null : new Error("User does not have  rights to perform this action.");

//        console.log(token + ":" + minRole + ":" + parentNodeId);
        callback(null);
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
            //console.log(req.param);
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