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

    node.getChildNodesDeep = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.getChildren(
            httpRequest.params.nodeid,
            true);
        writeApiResponse(httpResponse, promise);
    };

    app.get('/node/:nodeid', [middleware.authorization, middleware.authToken, cleanNodeId, node.getById]);
    app.get('/node/:nodeid/children',  [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodes]);
    // Not supported yet app.get(routePrefix + '/node/:nodeid/hydrate', [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodesAndContent]);
    app.get('/node/:nodeid/content', [middleware.authorization, middleware.authToken, cleanNodeId, node.getNodesContent]);
    app.get('/node/:nodeid/children/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodesDeep]);
    // Not yet supported app.get(routePrefix + '/node/:nodeid/assets/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getAssetsDeep]);
    // Not yet supported app.get(routePrefix + '/node/:nodeid/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getByIdDeep]);
    app.get('/node/:nodeid/assets', [middleware.authorization, middleware.authToken, cleanNodeId, node.getAssets]);
    app.get('/node/:nodeid/assets/:filename', [middleware.authorization, middleware.authToken, cleanNodeId, node.getAsset]);

    app.post('/node/:nodeid/assets/copy', [middleware.authorization, middleware.authToken, cleanNodeId, node.copyAsset]);
    app.post('/node/:nodeid/assets/move', [middleware.authorization, middleware.authToken, cleanNodeId, node.moveAsset]);
    app.post('/node/:nodeid/assets/rename', [middleware.authorization, middleware.authToken, cleanNodeId, node.renameAsset]);
    app.post('/node/:nodeid/assets', [middleware.authorization, middleware.authToken, cleanNodeId, node.attachAsset]);
    app.post('/node', [middleware.authorization, middleware.authToken, cleanNodeId, dehydrateRequestBody, node.insert]);
    app.post('/nodes',  [middleware.authorization, middleware.authToken, cleanNodeId, dehydrateRequestBody, node.insert]);
    app.post('/node/:nodeid/contenttype', [middleware.authorization, middleware.authToken, cleanNodeId, node.saveContentTypes]);

    app.delete('/node/:nodeid/assets/:filename', [middleware.authorization, middleware.authToken, cleanNodeId, node.deleteAsset]);
    app.delete('/node/:nodeid/assets', [middleware.authorization, middleware.authToken, cleanNodeId, node.deleteAllAssets]);
    app.delete('/node/:nodeid', [middleware.authorization, middleware.authToken, cleanNodeId, node.deleteNodeById]);

    app.put('/node/:nodeid', [middleware.authorization, middleware.authToken, cleanNodeId, dehydrateRequestBody, node.update]);

    return node;
};