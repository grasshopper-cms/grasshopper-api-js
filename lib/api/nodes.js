(function(){
    "use strict";

    var node = {},
        Response = require('./helpers/response'),
        Request = require('./helpers/request'),
        async = require('async'),
        _ = require('underscore'),
        nodes = require('../entities/nodes'),
        users = require('../entities/users'),
        permissions = require('../entities/permissions/node'),
        privileges = require('../entities/permissions/privileges'),
        response = new Response(),
        request = new Request();

    node.getById = function (req, res){
        nodes.getById(req.params.nodeid, response.writeCallback.bind(res));
    };

    node.deleteById = function(req, res){
        nodes.deleteById(req.params.nodeid, response.writeCallback.bind(res));
    };

    node.getChildNodes = function(req, res){
        var resp = [];

        nodes.getChildNodes(req.parent, false, function(err, obj){
            async.each(obj, function(node, next){
                if(permissions.allowed(node._id.toString(), req.identity.role, req.identity.permissions, privileges.available.READER)){
                    resp.push(node);
                }
                next();

            },function(){
                response.write(response.STATUS_CODES.SUCCESS, JSON.stringify(resp), res);
            });
        });
    };

    node.getAssets = function(req, res){
        nodes.getAssets(req.params.nodeid, response.writeCallback.bind(res));
    };

    node.copyAsset = function(req, res){
        nodes.copyAsset(req.params.nodeid, req.body.newnodeid, req.body.filename, response.writeCallback.bind(res));
    };

    node.moveAsset = function(req, res){
        nodes.moveAsset(req.params.nodeid, req.body.newnodeid, req.body.filename, response.writeCallback.bind(res));
    };

    node.renameAsset = function(req, res){
        nodes.renameAsset(req.params.nodeid, req.body.original, req.body.updated, response.writeCallback.bind(res));
    };

    node.deleteAsset = function(req, res){
        nodes.deleteAsset(req.params.nodeid, req.params.filename, response.writeCallback.bind(res));
    };

    node.deleteAllAssets = function(req, res){
        nodes.deleteAllAssets(req.params.nodeid, response.writeCallback.bind(res));
    };

    node.attachAsset = function(req, res){


        request.parseForm(req, function(err, fields, files) {
            function saveAsset(file, next){
                nodes.saveAsset(req.params.nodeid, file.originalFilename, file.path, function(err){
                    next(err);
                });
            }

            function done(err){
                if(err){
                    response.write(response.STATUS_CODES.SERVER_ERROR, JSON.stringify(err), res);
                }
                else {
                    response.write(response.STATUS_CODES.SUCCESS, JSON.stringify({message: "Success"}), res);
                }
            }

            if(files){
                async.each(files.file,saveAsset,done);
            }
        });
    };

    node.getAssetsDeep = function(req, res){

        var allowedNodes = [],
            resp = [];

            nodes.getAssets(req.params.nodeid, function(err, obj){
                resp.push(obj);

                /*
                 Get all child nodes. then iterate to only include nodes that the user has access to.
                 */
                nodes.getChildNodes(req.params.nodeid, false, function(err, obj){
                    async.each(obj, function(node, next){
                        if(permissions.allowed(node._id, req.identity.role, req.identity.permissions, privileges.available.READER)){
                            allowedNodes.push(node);
                        }

                        next();
                    },function(){
                        //We now have all of the node id's go get the files.
                        async.each(allowedNodes, function(node, next){
                            nodes.getAssets(node._id.toString(), function(err, obj){
                                resp.push(obj);
                                next();
                            });
                        },function(){
                            response.write(response.STATUS_CODES.SUCCESS, JSON.stringify(_.flatten(resp)), res);
                        });

                    });
                });
            });
    };

    node.getByIdDeep = function(req, res){
        var allowedNodes = [];

        nodes.getByIdDeep(req.params.nodeid, function(err, obj){
            if(err){
                response.write(response.STATUS_CODES.SUCCESS, JSON.stringify([]), res);
                return;
            }

            function checkPermissions(childnode, next){
                if(permissions.allowed(childnode._id.toString(), req.identity.role, req.identity.permissions, privileges.available.READER)){
                    allowedNodes.push(childnode);
                }

                next();
            }

            function done(){
                response.write(response.STATUS_CODES.SUCCESS, JSON.stringify(allowedNodes), res);
            }

            async.each(obj, checkPermissions, done);
        });
    };

    node.getChildNodesDeep = function(req, res){
        var allowedNodes = [];

        nodes.getChildNodesDeep(req.params.nodeid, function(err, obj){

            function checkPermissions(childnode, next){
                if(permissions.allowed(childnode._id.toString(), req.identity.role, req.identity.permissions, privileges.available.READER)){
                    allowedNodes.push(childnode);
                }

                next();
            }

            function done(){
                response.write(response.STATUS_CODES.SUCCESS, JSON.stringify(allowedNodes), res);
            }

            async.each(obj, checkPermissions, done);
        });
    };

    node.update = function(req, res){
        nodes.update(req.body, response.writeCallback.bind(res));
    };

    node.create = function(req, res){
        nodes.create(req.body, response.writeCallback.bind(res));
    };

    node.addContentTypes = function(req, res){
        nodes.addContentTypes(req.params.nodeid, req.body, response.writeCallback.bind(res));
    };

    node.deleteNodeById = function(req, res){
        nodes.deleteById(req.params.nodeid, response.writeCallback.bind(res));
    };

    node.deleteContentType = function(req, res){
        nodes.deleteContentTypes(req.params.cid, response.writeCallback.bind(res));
    };

    module.exports = node;
})();