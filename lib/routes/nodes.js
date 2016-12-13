module.exports = function(router){
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

    node.getBySlug = function (httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes
            .query({
                filters:{
                    key: 'slug',
                    cmp: '=',
                    value: httpRequest.params.slug
                }
            });
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

    node.move = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.move({
            op: httpRequest.body.op,
            from: httpRequest.body.from,
            to: httpRequest.body.to
        });
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

        request.parseForm(httpRequest).then(
            function(form){
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
            },
            function(err){
                err.code = Response.statusCodes.serverError;
                response.writeError(err);
            });
    };

    node.getChildNodesDeep = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.getChildren(
            httpRequest.params.nodeid,
            true);
        writeApiResponse(httpResponse, promise);
    };

    node.query = function(httpRequest, httpResponse){
        var promise = grasshopper.request(httpRequest.bridgetown.token).nodes.query(httpRequest.body);
        writeApiResponse(httpResponse, promise);
    };

    router.post('/node', [middleware.authorization, middleware.authToken, cleanNodeId, dehydrateRequestBody, node.insert]);

    router.route('/node/:nodeid')
        .get([middleware.authorization, middleware.authToken, cleanNodeId, node.getById])
        .delete([middleware.authorization, middleware.authToken, cleanNodeId, node.deleteNodeById])
        .put([middleware.authorization, middleware.authToken, cleanNodeId, dehydrateRequestBody, node.update]);

    router.route('/node/slug/:slug')
        .get([middleware.authorization, middleware.authToken, node.getBySlug]);

    router.route('/node/:nodeid/assets')
        .get([middleware.authorization, middleware.authToken, cleanNodeId, node.getAssets])
        .post([middleware.authorization, middleware.authToken, cleanNodeId, node.attachAsset])
        .delete([middleware.authorization, middleware.authToken, cleanNodeId, node.deleteAllAssets]);

    router.route('/node/:nodeid/assets/:filename')
        .get([middleware.authorization, middleware.authToken, cleanNodeId, node.getAsset])
        .delete([middleware.authorization, middleware.authToken, cleanNodeId, node.deleteAsset]);

    router.post('/node/move', [middleware.authorization, middleware.authToken, cleanNodeId, node.move]);

    router.post('/node/:nodeid/assets/copy', [middleware.authorization, middleware.authToken, cleanNodeId, node.copyAsset]);
    router.post('/node/:nodeid/assets/move', [middleware.authorization, middleware.authToken, cleanNodeId, node.moveAsset]);
    router.post('/node/:nodeid/assets/rename', [middleware.authorization, middleware.authToken, cleanNodeId, node.renameAsset]);
    router.get('/node/:nodeid/children',  [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodes]);
    router.get('/node/:nodeid/children/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodesDeep]);
    router.get('/node/:nodeid/content', [middleware.authorization, middleware.authToken, cleanNodeId, node.getNodesContent]);
    router.post('/node/:nodeid/contenttype', [middleware.authorization, middleware.authToken, cleanNodeId, node.saveContentTypes]);

    router.post('/nodes',  [middleware.authorization, middleware.authToken, cleanNodeId, dehydrateRequestBody, node.insert]);

    router.post('/node/query', [middleware.authorization, middleware.authToken, node.query]);

    // Not supported yet app.get('/node/:nodeid/hydrate', [middleware.authorization, middleware.authToken, cleanNodeId, node.getChildNodesAndContent]);
    // Not yet supported app.get('/node/:nodeid/assets/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getAssetsDeep]);
    // Not yet supported app.get('/node/:nodeid/deep', [middleware.authorization, middleware.authToken, cleanNodeId, node.getByIdDeep]);

    return node;
};