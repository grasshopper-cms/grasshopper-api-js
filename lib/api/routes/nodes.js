module.exports = function(app){
    "use strict";

    var node = {},
        async = require('async'),
        _ = require('underscore'),
        grasshopper = require('grasshopper-core'),
        bridgetown = require('bridgetown-api'),
        Response = bridgetown.Response,
        middleware = bridgetown.middleware,
        Builder = require('../middleware/Builder'),
        cleanNodeId = require('../middleware/cleanNodeId'),
        setParentOfNode = require('../middleware/setParentOfNode'),
        dehydrateRequestBody = require('../middleware/dehydrateRequestBody'),
        Request = require('../helpers/request'),
        nodes = require('../../entities/nodes'),
        users = require('../../entities/users'),
        permissions = require('../../entities/permissions/node'),
        privileges = require('../../entities/permissions/privileges'),
        routePrefix = (app.get('grasshopper route prefix')) ? app.get('grasshopper route prefix') : '',
        request = new Request();

    function writeApiResponse(httpResponse, promise){
        var response = new Response(httpResponse);
        response.writeFromPromise(promise);
    }

    node.getById = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.getById(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    node.deleteById = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.deleteById(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    node.getAssets = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.getAssets(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    node.getAsset = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.getAsset(httpRequest.params.nodeid, httpRequest.params.filename);
        writeApiResponse(httpResponse, promise);
    };

    node.update = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.update(httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    node.insert = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.insert(httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    node.saveContentTypes = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.saveContentTypes(httpRequest.params.nodeid, httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    node.deleteNodeById = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.deleteById(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    node.deleteContentType = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.deleteContentTypes(httpRequest.params.cid);
        writeApiResponse(httpResponse, promise);
    };

    node.copyAsset = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.copyAsset(httpRequest.params.nodeid, httpRequest.body.newnodeid, httpRequest.body.filename);
        writeApiResponse(httpResponse, promise);
    };

    node.moveAsset = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.moveAsset(httpRequest.params.nodeid, httpRequest.body.newnodeid, httpRequest.body.filename);
        writeApiResponse(httpResponse, promise);
    };

    node.renameAsset = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.renameAsset(httpRequest.params.nodeid, httpRequest.body.original, httpRequest.body.updated);
        writeApiResponse(httpResponse, promise);
    };

    node.deleteAsset = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.deleteAsset(httpRequest.params.nodeid, httpRequest.params.filename);
        writeApiResponse(httpResponse, promise);
    };

    node.deleteAllAssets = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.deleteAllAssets(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
    };

    node.getChildNodesAndContent = function(httpRequest, httpResponse){

        var resp = [],
            response = new Response(httpResponse);

        function addAllowedNodes(node, next){
            var userHasPermission = permissions.allowed(node._id.toString(), httpRequest.bridgetown.identity.role, httpRequest.bridgetown.identity.permissions, privileges.available.READER);

            if(userHasPermission){
                resp.push(node);
            }
            next();
        }

        function done() {
            response.writeSuccess(resp);
        }

        function getChildNodes(next){
            nodes.getChildNodes(httpRequest.params.nodeid).then(function(obj){
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

    node.getNodesContent = function(httpRequest, httpResponse){

        var resp = [],
            response = new Response(httpResponse);

        function done() {
            response.writeSuccess(resp);
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

        async.parallel([getContent],done);
    };


    node.getChildNodes = function(httpRequest, httpResponse){
        var resp = [],
            response = new Response(httpResponse);

        function addAllowedNodes(node, next){
            var userHasPermission = permissions.allowed(node._id.toString(), httpRequest.bridgetown.identity.role, httpRequest.bridgetown.identity.permissions, privileges.available.READER);

            if(userHasPermission){
                resp.push(node);
            }
            next();
        }

        function done() {
            response.writeSuccess(resp);
        }

        function iterateChildren(obj){
            async.each(obj, addAllowedNodes, done);
        }

        nodes.getChildNodes(httpRequest.params.nodeid).then(iterateChildren);
    };

    node.attachAsset = function(httpRequest, httpResponse){
        var response = new Response(httpResponse);

        request.parseForm(httpRequest).done(function(form){

            function done(err){
                if(err){
                    err.code = Response.statusCodes.serverError;
                    response.writeError(err);
                }
                else {
                    response.writeSuccess({message: "Success"});
                }
            }

            function saveAsset(file, next){
                nodes.saveAsset(httpRequest.params.nodeid, file.originalFilename, file.path).then(function(){
                    next();
                }).fail(function(err){
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
                    var userHasPermission = permissions.allowed(node._id, httpRequest.bridgetown.identity.role, httpRequest.bridgetown.identity.permissions, privileges.available.READER);

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
                        response.writeSuccess(_.flatten(resp));
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
                var userHasPermission = permissions.allowed(childnode._id.toString(), httpRequest.bridgetown.identity.role, httpRequest.bridgetown.identity.permissions, privileges.available.READER);

                if(userHasPermission){
                    allowedNodes.push(childnode);
                }

                next();
            }

            function done(){
                response.writeSuccess(allowedNodes);
            }

            async.each(nodeList, addNodeIfAllowed, done);
        })
            .fail(function(){
                response.writeSuccess([]);
            });
    };

    node.getChildNodesDeep = function(httpRequest, httpResponse){
        var allowedNodes = [],
            response = new Response(httpResponse);

        nodes.getChildNodesDeep(httpRequest.params.nodeid).then(function(nodeList){

            function addNodeIfAllowed(childnode, next){
                var userHasPermission = permissions.allowed(childnode._id.toString(), httpRequest.bridgetown.identity.role, httpRequest.bridgetown.identity.permissions, privileges.available.READER);

                if(userHasPermission){
                    allowedNodes.push(childnode);
                }

                next();
            }

            function done(){
                response.writeSuccess(allowedNodes);
            }

            async.each(nodeList, addNodeIfAllowed, done);
        });
    };

    app.get(routePrefix + '/node/:nodeid', [middleware.authorization, middleware.authToken, cleanNodeId, node.getById]);
    app.get(routePrefix + '/node/:nodeid/children',  [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodes]);
    app.get(routePrefix + '/node/:nodeid/hydrate', [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodesAndContent]);
    app.get(routePrefix + '/node/:nodeid/content', [middleware.authorization, middleware.authToken, cleanNodeId, node.getNodesContent]);
    app.get(routePrefix + '/node/:nodeid/children/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodesDeep]);
    app.get(routePrefix + '/node/:nodeid/assets/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getAssetsDeep]);
    app.get(routePrefix + '/node/:nodeid/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getByIdDeep]);
    app.get(routePrefix + '/node/:nodeid/assets', [middleware.authorization, middleware.authToken, cleanNodeId, node.getAssets]);
    app.get(routePrefix + '/node/:nodeid/assets/:filename', [middleware.authorization, middleware.authToken, cleanNodeId, node.getAsset]);

    app.post(routePrefix + '/node/:nodeid/assets/copy', [middleware.authorization, middleware.authToken, cleanNodeId, node.copyAsset]);
    app.post(routePrefix + '/node/:nodeid/assets/move', [middleware.authorization, middleware.authToken, cleanNodeId, node.moveAsset]);
    app.post(routePrefix + '/node/:nodeid/assets/rename', [middleware.authorization, middleware.authToken, cleanNodeId, node.renameAsset]);
    app.post(routePrefix + '/node/:nodeid/assets', [middleware.authorization, middleware.authToken, cleanNodeId, node.attachAsset]);
    app.post(routePrefix + '/node', [middleware.authorization, middleware.authToken, cleanNodeId, dehydrateRequestBody, node.insert]);
    app.post(routePrefix + '/nodes',  [middleware.authorization, middleware.authToken, cleanNodeId, dehydrateRequestBody, node.insert]);
    app.post(routePrefix + '/node/:nodeid/contenttype', [middleware.authorization, middleware.authToken, cleanNodeId, node.saveContentTypes]);

    app.del(routePrefix + '/node/:nodeid/assets/:filename', [middleware.authorization, middleware.authToken, cleanNodeId, node.deleteAsset]);
    app.del(routePrefix + '/node/:nodeid/assets', [middleware.authorization, middleware.authToken, cleanNodeId, node.deleteAllAssets]);
    app.del(routePrefix + '/node/:nodeid', [middleware.authorization, middleware.authToken, cleanNodeId, node.deleteNodeById]);

    app.put(routePrefix + '/node/:nodeid', [middleware.authorization, middleware.authToken, cleanNodeId, dehydrateRequestBody, node.update]);

    return node;
};