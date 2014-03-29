module.exports = function(app){
    'use strict';

    var node = {},
        async = require('async'),
        grasshopper = require('grasshopper-core'),
        bridgetown = require('bridgetown-api'),
        Response = bridgetown.Response,
        middleware = bridgetown.middleware,
        cleanNodeId = require('../middleware/cleanNodeId'),
        dehydrateRequestBody = require('../middleware/dehydrateRequestBody'),
        Request = require('../utils/request'),
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
        var promise = grasshopper.request(httpRequest.bridgetown.token).assets.list({
            nodeid: httpRequest.params.nodeid
        });
        writeApiResponse(httpResponse, promise);
    };

    node.getAsset = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).assets.find({
            nodeid: httpRequest.params.nodeid,
            filename: httpRequest.params.filename
        });
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
        var promise = grasshopper.request(httpRequest.bridgetown.token).assets.copy({
                nodeid: httpRequest.params.nodeid,
                newnodeid: httpRequest.body.newnodeid,
                filename: httpRequest.body.filename
            });
        writeApiResponse(httpResponse, promise);
    };

    node.moveAsset = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).assets.move({
                nodeid: httpRequest.params.nodeid,
                filename: httpRequest.body.filename,
                newnodeid: httpRequest.body.newnodeid
            });
        writeApiResponse(httpResponse, promise);
    };

    node.renameAsset = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).assets.rename({
            nodeid: httpRequest.params.nodeid,
            original: httpRequest.body.original,
            updated: httpRequest.body.updated
        });
        writeApiResponse(httpResponse, promise);
    };

    node.deleteAsset = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).assets.delete({
                nodeid: httpRequest.params.nodeid,
                filename: httpRequest.params.filename
            });
        writeApiResponse(httpResponse, promise);
    };

    node.deleteAllAssets = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).assets.deleteAll({
            nodeid: httpRequest.params.nodeid
        });
        writeApiResponse(httpResponse, promise);
    };



    node.getNodesContent = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).content.query({
            nodes: [httpRequest.params.nodeid]
        });
        writeApiResponse(httpResponse, promise);
    };


    node.getChildNodes = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.getChildren(httpRequest.params.nodeid);
        writeApiResponse(httpResponse, promise);
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
                    response.writeSuccess({message: 'Success'});
                }
            }

            function saveAsset(file, next){
                grasshopper.request(httpRequest.bridgetown.token).assets.save({
                    nodeid: httpRequest.params.nodeid,
                    filename: file.originalFilename,
                    path: file.path
                }).then(
                    function(){
                        next();
                    },
                    function(err){
                        next(err);
                    }
                );
            }
            if(form.files){
                async.each(form.files.file,saveAsset,done);
            }
        });
    };

    /*
    node.getAssetsDeep = function(httpRequest, httpResponse){

        var allowedNodes = [],
            resp = [],
            response = new Response(httpResponse);

        var promise = grasshopper.request(httpRequest.bridgetown.token).assets.list(httpRequest.params.nodeid);

        nodes.getAssets(httpRequest.params.nodeid).then(function(assetList){
            resp.push(assetList);

            //
            // Get all child nodes. then iterate to only include nodes that the user has access to.
            //
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
    };*/

    /*
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
    };*/

    node.getChildNodesDeep = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.getChildren(
            httpRequest.params.nodeid,
            true);
        writeApiResponse(httpResponse, promise);
    };

    app.get(routePrefix + '/node/:nodeid', [middleware.authorization, middleware.authToken, cleanNodeId, node.getById]);
    app.get(routePrefix + '/node/:nodeid/children',  [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodes]);
    // Not supported yet app.get(routePrefix + '/node/:nodeid/hydrate', [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodesAndContent]);
    app.get(routePrefix + '/node/:nodeid/content', [middleware.authorization, middleware.authToken, cleanNodeId, node.getNodesContent]);
    app.get(routePrefix + '/node/:nodeid/children/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodesDeep]);
    // Not yet supported app.get(routePrefix + '/node/:nodeid/assets/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getAssetsDeep]);
    // Not yet supported app.get(routePrefix + '/node/:nodeid/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getByIdDeep]);
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