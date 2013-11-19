/**
 * Module that is a proxy for all entity modules
 * Usage: api.proxy('users').<method>
 */
module.exports = function(app){
    "use strict";

    var Permissions = require('./security/permissions/global'),
        PermissionsByNode = require('./security/permissions/node'),
        resolveParentNodeId = require('./security/resolveparent'),
        authorize = require('./security/authorization'),
        authenticate = require('./security/authentication'),
        resolveParentNodeId = require('./security/resolveparent'),
        permissions = new Permissions(),
        permissionsByNode = new PermissionsByNode(),
        routes = {
            token:  require('./token'),
            users: require('./users'),
            nodes: require('./nodes'),
            content: require('./content'),
            contentTypes: require('./contentTypes')
        };

    app.get('/token', [authorize, routes.token.get]);

    app.post('/content/:nodeid', [authorize, authenticate, permissions.requireAuthor, routes.content.create]);
    app.put('/content/:nodeid/:id', [authorize, authenticate, permissions.requireAuthor, routes.content.update]);
    app.get('/content/:nodeid/:id', [authorize, authenticate, permissions.requireReader, routes.content.getById]);
    app.del('/content/:nodeid/:id', [authorize, authenticate, permissions.requireAuthor, routes.content.deleteById]);


    app.get('/users/:id', [authorize, authenticate, permissions.requireAdmin, routes.users.getById]);
    app.delete('/users/:id', [authorize, authenticate, permissions.requireAdmin, routes.users.deleteById]);
    app.delete('/users/:id/permissions/:nodeid', [authorize, authenticate, permissions.requireAdmin, routes.users.deletePermission]);

    app.put('/users', [authorize, authenticate, permissions.requireAdmin, routes.users.update]);
    app.put('/user', [authorize, authenticate, permissions.requireAdminOrSelf, routes.users.update]);
    app.put('/users/:id', [authorize, authenticate, permissions.requireAdminOrSelf, routes.users.update]);
    app.post('/users/:id/permissions', [authorize, authenticate, permissions.requireAdmin, routes.users.updatePermission]);
    app.get('/users', [authorize, authenticate, permissions.requireAdmin, routes.users.getList]);
    app.get('/user', [authorize, authenticate, routes.users.getCurrentUser]);
    app.post('/users', [authorize, authenticate, permissions.requireAdmin, routes.users.create]);


    app.get('/node/:nodeid/children', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireReader, routes.nodes.getChildNodes]);
    app.get('/node/:nodeid/children/deep', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireReader, routes.nodes.getChildNodesDeep]);
    app.get('/node/:nodeid/assets/deep', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.getAssetsDeep]);
    app.get('/node/:nodeid/deep', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireReader, routes.nodes.getByIdDeep]);
    app.get('/node/:nodeid/assets', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireReader, routes.nodes.getAssets]);
    app.post('/node/:nodeid/assets/copy', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.copyAsset]);
    app.post('/node/:nodeid/assets/move', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.moveAsset]);
    app.post('/node/:nodeid/assets/rename', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.renameAsset]);
    app.del('/node/:nodeid/assets/:filename', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.deleteAsset]);
    app.del('/node/:nodeid/assets', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.deleteAllAssets]);
    app.post('/node/:nodeid/assets',[authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.attachAsset]);
    app.get('/node/:nodeid', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireReader, routes.nodes.getById]);
    app.del('/node/:nodeid', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.deleteNodeById]);

    app.post('/node', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.create]);
    app.post('/node/:nodeid/contenttype', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.addContentTypes]);
    app.post('/nodes', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, routes.nodes.create]);

    app.get('/contenttypes',  [authorize, authenticate, permissions.requireAdmin, routes.contentTypes.getList]);
    app.get('/contenttypes/:id', [authorize, authenticate, permissions.requireAdmin, routes.contentTypes.getById]);
    app.delete('/contenttypes/:id',  [authorize, authenticate, permissions.requireAdmin, routes.contentTypes.deleteById]);
    app.put('/contenttypes',  [authorize, authenticate, permissions.requireAdmin, routes.contentTypes.update]);
    app.post('/contenttypes',  [authorize, authenticate, permissions.requireAdmin, routes.contentTypes.create]);

};