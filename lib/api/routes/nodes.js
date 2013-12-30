(function(){
    "use strict";

    var node = {},
        async = require('async'),
        _ = require('underscore'),
        Response = require('../helpers/response'),
        Request = require('../helpers/request'),
        nodes = require('../../entities/nodes'),
        users = require('../../entities/users'),
        permissions = require('../../entities/permissions/node'),
        privileges = require('../../entities/permissions/privileges'),
        request = new Request(),
        GET_CONTENT = 'get content';

    function writeApiResponse(httpResponse, promise){
        var response = new Response(httpResponse);
        response.writeFromPromise(promise);
    }

    node.getById = function (httpRequest, httpResponse){
        var promise = nodes.getById(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    node.deleteById = function(httpRequest, httpResponse){
        var promise = nodes.deleteById(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    node.getAssets = function(httpRequest, httpResponse){
        var promise = nodes.getAssets(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    node.getAsset = function(httpRequest, httpResponse){
        var promise = nodes.getAsset(httpRequest.params.nodeid, httpRequest.params.filename);
        writeApiResponse(httpResponse, promise);
    };

    node.update = function(httpRequest, httpResponse){
        var promise = nodes.update(httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    node.create = function(httpRequest, httpResponse){
        var promise = nodes.create(httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    node.addContentTypes = function(httpRequest, httpResponse){
        var promise = nodes.addContentTypes(httpRequest.params.nodeid, httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    node.deleteNodeById = function(httpRequest, httpResponse){
        var promise = nodes.deleteById(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    node.deleteContentType = function(httpRequest, httpResponse){
        var promise = nodes.deleteContentTypes(httpRequest.params.cid);
        writeApiResponse(httpResponse, promise);
    };

    node.copyAsset = function(httpRequest, httpResponse){
        var promise = nodes.copyAsset(httpRequest.params.nodeid, httpRequest.body.newnodeid, httpRequest.body.filename);
        writeApiResponse(httpResponse, promise);
    };

    node.moveAsset = function(httpRequest, httpResponse){
        var promise = nodes.moveAsset(httpRequest.params.nodeid, httpRequest.body.newnodeid, httpRequest.body.filename);
        writeApiResponse(httpResponse, promise);
    };

    node.renameAsset = function(httpRequest, httpResponse){
        var promise = nodes.renameAsset(httpRequest.params.nodeid, httpRequest.body.original, httpRequest.body.updated);
        writeApiResponse(httpResponse, promise);
    };

    node.deleteAsset = function(httpRequest, httpResponse){
        var promise = nodes.deleteAsset(httpRequest.params.nodeid, httpRequest.params.filename);
        writeApiResponse(httpResponse, promise);
    };

    node.deleteAllAssets = function(httpRequest, httpResponse){
        var promise = nodes.deleteAllAssets(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    node.getChildNodesAndContent = function(httpRequest, httpResponse){

        var resp = [],
            response = new Response(httpResponse);

        function addAllowedNodes(node, next){
            var userHasPermission = permissions.allowed(node._id.toString(), httpRequest.identity.role, httpRequest.identity.permissions, privileges.available.READER);

            if(userHasPermission){
                resp.push(node);
            }
            next();
        }

        function done() {
            response.write(response.STATUS_CODES.SUCCESS, JSON.stringify(resp));
        }

        function getChildNodes(next){
            nodes.getChildNodes(httpRequest.parent).then(function(obj){
                async.each(obj, addAllowedNodes, next);
            });
        }

        function getContent(next){
            require('../../entities/content').query(
                httpRequest.params.nodeid,
                undefined,
                undefined,
                true
            ).then(function(obj) {
                if (obj) {
                    resp = resp.concat(obj);
                }
                next();
            }, function() {
                next();
            });
        }

        async.parallel([getChildNodes, getContent],done);

    };

    node.getChildNodes = function(httpRequest, httpResponse){
        var resp = [],
            response = new Response(httpResponse);

        function addAllowedNodes(node, next){
            var userHasPermission = permissions.allowed(node._id.toString(), httpRequest.identity.role, httpRequest.identity.permissions, privileges.available.READER);

            if(userHasPermission){
                resp.push(node);
            }
            next();
        }

        function done() {
            response.write(response.STATUS_CODES.SUCCESS, JSON.stringify(resp));
        }

        function iterateChildren(obj){
            async.each(obj, addAllowedNodes, done);
        }

        nodes.getChildNodes(httpRequest.parent).then(iterateChildren);
    };

    node.attachAsset = function(httpRequest, httpResponse){
        var response = new Response(httpResponse);

        request.parseForm(httpRequest).done(function(form){

            function done(err){
                if(err){
                    response.write(response.STATUS_CODES.SERVER_ERROR, JSON.stringify(err));
                }
                else {
                    response.write(response.STATUS_CODES.SUCCESS, JSON.stringify({message: "Success"}));
                }
            }

            function saveAsset(file, next){
                nodes.saveAsset(httpRequest.params.nodeid, file.originalFilename, file.path).done(function(response, err){
                    next(err);
                });
            }
            if(form.files){
                async.each(form.files.file,saveAsset,done);
            }
        });
    };

    node.getAssetsDeep = function(httpRequest, httpResponse){

        var allowedNodes = [],
            resp = [],
            response = new Response(httpResponse);

            nodes.getAssets(httpRequest.params.nodeid).then(function(assetList){
                resp.push(assetList);

                /*
                 Get all child nodes. then iterate to only include nodes that the user has access to.
                 */
                nodes.getChildNodes(httpRequest.params.nodeid, false).then(function(nodeList){

                    function addNodeIfAllowed(node, next){
                        var userHasPermission = permissions.allowed(node._id, httpRequest.identity.role, httpRequest.identity.permissions, privileges.available.READER);

                        if(userHasPermission){
                            allowedNodes.push(node);
                        }

                        next();
                    }

                    function done(){
                        function getAssetsForNode(node, next){
                            nodes.getAssets(node._id.toString()).then(function(assetList){
                                resp.push(assetList);
                                next();
                            });
                        }

                        async.each(allowedNodes, getAssetsForNode, function(){
                            response.write(response.STATUS_CODES.SUCCESS, JSON.stringify(_.flatten(resp)));
                        });
                    }

                    async.each(nodeList, addNodeIfAllowed, done);
                });
            });
    };

    node.getByIdDeep = function(httpRequest, httpResponse){
        var allowedNodes = [],
            response = new Response(httpResponse);

        nodes.getByIdDeep(httpRequest.params.nodeid).then(function(nodeList){

            function addNodeIfAllowed(childnode, next){
                var userHasPermission = permissions.allowed(childnode._id.toString(), httpRequest.identity.role, httpRequest.identity.permissions, privileges.available.READER);

                if(userHasPermission){
                    allowedNodes.push(childnode);
                }

                next();
            }

            function done(){
                response.write(response.STATUS_CODES.SUCCESS, JSON.stringify(allowedNodes));
            }

            async.each(nodeList, addNodeIfAllowed, done);
        })
        .fail(function(){
            response.write(response.STATUS_CODES.SUCCESS, JSON.stringify([]));
        });
    };

    node.getChildNodesDeep = function(httpRequest, httpResponse){
        var allowedNodes = [],
            response = new Response(httpResponse);

        nodes.getChildNodesDeep(httpRequest.params.nodeid).then(function(nodeList){

            function addNodeIfAllowed(childnode, next){
                var userHasPermission = permissions.allowed(childnode._id.toString(), httpRequest.identity.role, httpRequest.identity.permissions, privileges.available.READER);

                if(userHasPermission){
                    allowedNodes.push(childnode);
                }

                next();
            }

            function done(){
                response.write(response.STATUS_CODES.SUCCESS, JSON.stringify(allowedNodes));
            }

            async.each(nodeList, addNodeIfAllowed, done);
        });
    };

    module.exports = node;
})();