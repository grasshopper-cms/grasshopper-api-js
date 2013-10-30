(function(){
    "use strict";

    var node = {},
        async = require('async'),
        _ = require('underscore'),
        multiparty = require('multiparty'),
        nodes = require('../entities/nodes'),
        users = require('../entities/users'),
        base = require('./api-base');


    function userCanForNode(user, parentNodeId, minRole, callback){
        var isAllowed = _.find(user.permissions, function(permission){
            var userPrivLevel = base.AVAILABLE_PRIVILEGES[permission.role.toUpperCase()];

            return (permission.nodeid.toString() == parentNodeId &&  (userPrivLevel <= parseInt(minRole, 10)));
        });

        callback((!isAllowed) ? new Error("User does not have enough privileges.") : null);
    }

    function userPreventedForNode(user, parentNodeId, minRole, callback){
        var restriction = _.find(user.permissions, function(permission){
            var userPrivLevel = parseInt(base.AVAILABLE_PRIVILEGES[permission.role.toUpperCase()], 10);

            return (permission.nodeid.toString() == parentNodeId &&  (userPrivLevel >= parseInt(minRole, 10)));
        });

        callback((restriction) ? new Error("User does not have enough privileges.") : null);
    }

    function resolveRequestParams(req){
        var input = req.params.id + (req.params[0] || '');

        if(input.indexOf('/') > -1){
            req.params.type = 'slug';
            req.params.id = '/' + input;
        }
        else if(!req.params.id.match(/^[0-9a-fA-F]{24}$/)){
            req.params.type = 'slug';
        }

        return req;
    }

    function userCan(token, minRole, parentNodeId, callback){

        async.waterfall([
            function(cb){
                users.getById(token.profile._id, function(err, obj){
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
            var error = ((permissions.userPermission && !permissions.nodeRestriction) || permissions.nodePermission) ? null : new Error("User does not have rights to perform this action.");
            callback(error);
        });
    }


    node.getBySlug = function(req, res){
        nodes.getBySlug(req.params.id, function(err, obj){
            if(err){
                if(err.message.indexOf('[404]') > -1){
                    base.write(base.STATUS_CODES.NOT_FOUND, JSON.stringify(err), res);
                }
                else {
                    base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                }
                return;
            }

            base.authenticateRequest(req, res, function(token){
                userCan(token, base.AVAILABLE_PRIVILEGES.READER, obj._id, function(err){
                    if(err){
                        base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(obj), res);
                    }
                });
            });
        });
    };

    node.getById = function (req, res){
        req = resolveRequestParams(req);

        if(req.params.type && req.params.type == 'slug'){
            node.getBySlug(req, res);
            return;
        }

        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.READER, req.params.id, function(err){

                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    nodes.getById(req.params.id, function(err, obj){
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

    node.deleteById = function(req, res){
        base.authenticateRequest(req, res, function(token){

            base.userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    nodes.deleteById(req.params.id, function(err){
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
        base.authenticateRequest(req, res, function(token){

            userCan(token, base.AVAILABLE_PRIVILEGES.READER, req.params.id, function(err) {
                var resp = [];

                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    /*
                     Get all child nodes. then iterate to only include nodes that the user has access to.
                     */
                    nodes.getChildNodes(req.params.id, false, function(err, obj){
                        async.each(obj, function(node, next){
                            userCan(token, base.AVAILABLE_PRIVILEGES.READER, node._id, function(error) {
                                if(!error) {
                                    resp.push(node);
                                }
                                next();
                            });

                        },function(){
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(resp), res);
                        });
                    });
                }
            });
        });
    };

    node.getAssets = function(req, res){
        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.READER, req.params.id, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    nodes.getAssets(req.params.id, function(err, obj){
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

    node.copyAsset = function(req, res){
        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, req.params.id, function(err){
                if(err){ base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res); return; }

                nodes.copyAsset(req.params.id, req.body.newnodeid, req.body.filename, function(err){
                    if(err){
                        base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify({message: "Success"}), res);
                    }
                });
            });
        });
    };

    node.moveAsset = function(req, res){
        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, req.params.id, function(err){
                if(err){ base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res); return; }

                nodes.moveAsset(req.params.id, req.body.newnodeid, req.body.filename, function(err){
                    if(err){
                        base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify({message: "Success"}), res);
                    }
                });
            });
        });
    };

    node.renameAsset = function(req, res){
        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, req.params.id, function(err){
                if(err){ base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res); return; }

                nodes.renameAsset(req.params.id, req.body.original, req.body.updated, function(err){
                    if(err){
                        base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify({message: "Success"}), res);
                    }
                });
            });
        });
    };

    node.deleteAsset = function(req, res){
        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, req.params.id, function(err){
                if(err){ base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res); return; }

                nodes.deleteAsset(req.params.id, req.params.filename, function(err){
                    if(err){
                        base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify({message: "Success"}), res);
                    }
                });
            });
        });
    };

    node.deleteAllAssets = function(req, res){
        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, req.params.id, function(err){
                if(err){ base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res); return; }

                nodes.deleteAllAssets(req.params.id, function(err){
                    if(err){
                        base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                    }
                    else {
                        base.write(base.STATUS_CODES.SUCCESS, JSON.stringify({message: "Success"}), res);
                    }
                });
            });
        });
    };

    node.attachAsset = function(req, res){
        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, req.params.id, function(err){
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    var form = new multiparty.Form();
                    form.on('error', function(err){
                        base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                    });

                    form.parse(req, function(err, fields, files) {
                        function saveAsset(file, next){
                            nodes.saveAsset(req.params.id, file.originalFilename, file.path, function(err){
                                next(err);
                            });
                        }

                        function done(err){
                            if(err){
                                base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                            }
                            else {
                                base.write(base.STATUS_CODES.SUCCESS, JSON.stringify({message: "Success"}), res);
                            }
                        }

                        if(files){
                            async.each(files.file,saveAsset,done);
                        }
                    });
                }
            });
        });
    };

    node.getAssetsDeep = function(req, res){
        base.authenticateRequest(req, res, function(token){

            userCan(token, base.AVAILABLE_PRIVILEGES.READER, req.params.id, function(err) {
                var allowedNodes = [];

                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    var resp = [];

                    nodes.getAssets(req.params.id, function(err, obj){
                        resp.push(obj);

                        /*
                         Get all child nodes. then iterate to only include nodes that the user has access to.
                         */
                        nodes.getChildNodes(req.params.id, false, function(err, obj){
                            async.each(obj, function(node, next){
                                userCan(token, base.AVAILABLE_PRIVILEGES.READER, node._id, function(error) {
                                    if(!error) {
                                        allowedNodes.push(node);
                                    }
                                    next();
                                });

                            },function(){
                                //We now have all of the node id's go get the files.
                                async.each(allowedNodes, function(node, next){
                                    nodes.getAssets(node._id.toString(), function(err, obj){
                                        resp.push(obj);
                                        next();
                                    });
                                },function(){
                                    base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(_.flatten(resp)), res);
                                });

                            });
                        });
                    });
                }
            });
        });
    };

    node.getByIdDeep = function(req, res){
        base.authenticateRequest(req, res, function(token){

            userCan(token, base.AVAILABLE_PRIVILEGES.READER, req.params.id, function(err) {
                var allowedNodes = [];

                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {

                    nodes.getByIdDeep(req.params.id, function(err, obj){
                        if(err){
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify([]), res);
                            return;
                        }

                        function checkPermissions(childnode, next){
                            userCan(token, base.AVAILABLE_PRIVILEGES.READER, childnode._id.toString(), function(error) {
                                if(!error) {
                                    allowedNodes.push(childnode);
                                }
                                next();
                            });
                        }

                        function done(){
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(allowedNodes), res);
                        }

                        async.each(obj, checkPermissions, done);
                    });
                }
            });
        });
    };

    node.getChildNodesDeep = function(req, res){
        base.authenticateRequest(req, res, function(token){

            userCan(token, base.AVAILABLE_PRIVILEGES.READER, req.params.id, function(err) {
                var allowedNodes = [];

                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {

                    nodes.getChildNodesDeep(req.params.id, function(err, obj){

                        function checkPermissions(childnode, next){
                            userCan(token, base.AVAILABLE_PRIVILEGES.READER, childnode._id.toString(), function(error) {
                                if(!error) {
                                    allowedNodes.push(childnode);
                                }
                                next();
                            });
                        }

                        function done(){
                            base.write(base.STATUS_CODES.SUCCESS, JSON.stringify(allowedNodes), res);
                        }

                        async.each(obj, checkPermissions, done);
                    });
                }
            });
        });
    };

    node.describe = function (req, res){
        base.authenticateRequest(req, res, function(token){

            base.userCan(token, base.AVAILABLE_PRIVILEGES.READER, function(err){

                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    nodes.describe(function(err, obj){
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

                    nodes.update(req.body, function(err, obj){
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
                    nodes.create(req.body, function(err, obj){
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

    node.addContentTypes = function(req, res){
        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, req.params.id, function(err) {
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    nodes.addContentTypes(req.params.id, req.body, function(err){
                        if(err){
                            base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify({message: err.message}), res);
                        }
                        else {
                            base.write(base.STATUS_CODES.SUCCESS, "Success", res);
                        }
                    });
                }
            });
        });
    };

    node.deleteContentType = function(req, res){
        base.authenticateRequest(req, res, function(token){
            userCan(token, base.AVAILABLE_PRIVILEGES.EDITOR, req.params.id, function(err) {
                if(err){
                    base.write(base.STATUS_CODES.FORBIDDEN, base.getStatusMessage(base.STATUS_CODES.FORBIDDEN), res);
                }
                else {
                    nodes.deleteContentTypes(req.params.cid, function(err, obj){
                        if(err){
                            base.write(base.STATUS_CODES.SERVER_ERROR, JSON.stringify({message: err.message}), res);
                        }
                        else {
                            base.write(base.STATUS_CODES.SUCCESS, "Success", res);
                        }
                    });
                }
            });
        });
    };

    module.exports = node;
})();