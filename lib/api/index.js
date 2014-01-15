/**
 * Module that is a proxy for all entity modules
 * Usage: api.proxy('users').<method>
 */
module.exports = function(app){
    "use strict";

    var Permissions = require('./security/global'),
        PermissionsByNode = require('./security/node'),
        bridgetown = require('bridgetown-api'),
        middleware = bridgetown.middleware,
        setParentOfNode = require('./routes/preconditions/setParentOfNode'),
        setParentOfContent = require('./routes/preconditions/setParentOfContent'),
        dehydrateRequestBody = require('./routes/preconditions/dehydrateRequestBody'),
        cleanNodeId = require('./routes/preconditions/cleanNodeId'),
        authenticate = require('./routes/preconditions/authentication'),

        permissions = new Permissions(),
        permissionsByNode = new PermissionsByNode(),
        routes = {
            token:  require('./routes/token'),
            users: require('./routes/users'),
            nodes: require('./routes/nodes'),
            content: require('./routes/content'),
            contentTypes: require('./routes/contentTypes')
        };

    app.get('/token', [middleware.authorization, routes.token.get]);
    app.get('/token/new', [middleware.authorization, authenticate, routes.token.getNew]);
    app.get('/token/logout', [middleware.authorization, authenticate, routes.token.deleteById]);

    app.post('/content', [middleware.authorization, authenticate, setParentOfContent, permissionsByNode.requireAuthor, routes.content.create]);
    app.post('/content/query', [middleware.authorization, authenticate, permissions.requireReader, routes.content.query]);
    app.put('/content/:id', [middleware.authorization, authenticate, setParentOfContent, permissionsByNode.requireAuthor, routes.content.update]);
    app.get('/content/:id', [middleware.authorization, authenticate, setParentOfContent, permissionsByNode.requireReader, routes.content.getById]);
    app.del('/content/:id', [middleware.authorization, authenticate, setParentOfContent, permissionsByNode.requireAuthor, routes.content.deleteById]);


    app.get('/users/:id', [middleware.authorization, authenticate, permissions.requireAdmin, routes.users.getById]);
    app.delete('/users/:id', [middleware.authorization, authenticate, permissions.requireAdmin, routes.users.deleteById]);
    app.delete('/users/:id/permissions/:nodeid', [middleware.authorization, authenticate, permissions.requireAdmin, routes.users.deletePermission]);

    app.put('/users', [middleware.authorization, authenticate, permissions.requireAdmin, routes.users.update]);
    app.put('/user', [middleware.authorization, authenticate, permissions.requireAdminOrSelf, routes.users.update]);
    app.put('/users/:id', [middleware.authorization, authenticate, permissions.requireAdminOrSelf, routes.users.update]);
    app.post('/users/:id/permissions', [middleware.authorization, authenticate, permissions.requireAdmin, routes.users.updatePermission]);
    app.get('/users', [middleware.authorization, authenticate, permissions.requireAdmin, routes.users.getList]);
    app.get('/user', [middleware.authorization, authenticate, routes.users.getCurrentUser]);
    app.post('/users', [middleware.authorization, authenticate, permissions.requireAdmin, routes.users.create]);
    app.post('/users/query', [middleware.authorization, authenticate, permissions.requireAdmin, routes.users.query]);





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






    app.get('/contenttypes',  [middleware.authorization, authenticate, permissions.requireAdmin, routes.contentTypes.getList]);
    app.get('/contenttypes/:id', [middleware.authorization, authenticate, permissions.requireAdmin, routes.contentTypes.getById]);
    app.delete('/contenttypes/:id',  [middleware.authorization, authenticate, permissions.requireAdmin, routes.contentTypes.deleteById]);
    app.put('/contenttypes',  [middleware.authorization, authenticate, permissions.requireAdmin, routes.contentTypes.update]);
    app.post('/contenttypes',  [middleware.authorization, authenticate, permissions.requireAdmin, routes.contentTypes.create]);

};