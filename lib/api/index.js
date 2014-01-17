/**
 * Module that is a proxy for all entity modules
 * Usage: api.proxy('users').<method>
 */
module.exports = function(app){
    "use strict";

    var Permissions = require('./middleware/usersecurity'),
        PermissionsByNode = require('./middleware/nodesecurity'),
        bridgetown = require('bridgetown-api'),
        middleware = bridgetown.middleware,
        tokens = require('../entities/tokens'),
        setParentOfNode = require('./routes/preconditions/setParentOfNode'),
        setParentOfContent = require('./routes/preconditions/setParentOfContent'),
        dehydrateRequestBody = require('./routes/preconditions/dehydrateRequestBody'),
        cleanNodeId = require('./routes/preconditions/cleanNodeId'),
        authenticate = require('./routes/preconditions/authentication'),

        permissions = new Permissions(),
        permissionsByNode = new PermissionsByNode(),
        routes = {
            nodes: require('./routes/nodes'),
            content: require('./routes/content')
        };

    require('./routes/token')(app);
    require('./routes/users')(app);
    require('./routes/contentTypes')(app);

    bridgetown.configure(function(){
        this.validate.token(tokens.validate);
    });

    app.post('/content', [middleware.authorization, authenticate, setParentOfContent, permissionsByNode.requireAuthor, routes.content.create]);
    app.post('/content/query', [middleware.authorization, authenticate, permissions.requireReader, routes.content.query]);
    app.put('/content/:id', [middleware.authorization, authenticate, setParentOfContent, permissionsByNode.requireAuthor, routes.content.update]);
    app.get('/content/:id', [middleware.authorization, authenticate, setParentOfContent, permissionsByNode.requireReader, routes.content.getById]);
    app.del('/content/:id', [middleware.authorization, authenticate, setParentOfContent, permissionsByNode.requireAuthor, routes.content.deleteById]);

    app.get('/node/:nodeid/children', [middleware.authorization, authenticate, cleanNodeId, setParentOfNode, permissionsByNode.requireReader, routes.nodes.getChildNodes]);
    app.get('/node/:nodeid/hydrate', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireReader, routes.nodes.getChildNodesAndContent]);
    app.get('/node/:nodeid/children/deep', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireReader, routes.nodes.getChildNodesDeep]);
    app.get('/node/:nodeid/assets/deep', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireEditor, routes.nodes.getAssetsDeep]);
    app.get('/node/:nodeid/deep', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireReader, routes.nodes.getByIdDeep]);
    app.get('/node/:nodeid/assets', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireReader, routes.nodes.getAssets]);
    app.get('/node/:nodeid/assets/:filename', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireReader, routes.nodes.getAsset]);
    app.post('/node/:nodeid/assets/copy', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireEditor, routes.nodes.copyAsset]);
    app.post('/node/:nodeid/assets/move', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireEditor, routes.nodes.moveAsset]);
    app.post('/node/:nodeid/assets/rename', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireEditor, routes.nodes.renameAsset]);
    app.del('/node/:nodeid/assets/:filename', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireEditor, routes.nodes.deleteAsset]);
    app.del('/node/:nodeid/assets', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireEditor, routes.nodes.deleteAllAssets]);
    app.post('/node/:nodeid/assets',[middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireEditor, routes.nodes.attachAsset]);
    app.get('/node/:nodeid', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireReader, routes.nodes.getById]);
    app.put('/node/:nodeid', [middleware.authorization, authenticate, cleanNodeId,  dehydrateRequestBody, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.update]);
    app.del('/node/:nodeid', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireEditor, routes.nodes.deleteNodeById]);

    app.post('/node', [middleware.authorization, authenticate, cleanNodeId, dehydrateRequestBody, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.create]);
    app.post('/node/:nodeid/contenttype', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireEditor, routes.nodes.addContentTypes]);
    app.post('/nodes', [middleware.authorization, authenticate, cleanNodeId,  setParentOfNode, permissionsByNode.requireEditor, routes.nodes.create]);

};