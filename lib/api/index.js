/**
 * Module that is a proxy for all entity modules
 * Usage: api.proxy('users').<method>
 */
module.exports = function(app){
    "use strict";

    var Permissions = require('./security/global'),
        PermissionsByNode = require('./security/node'),
        setParentOfNode = require('./routes/preconditions/setParentOfNode'),
        setParentOfContent = require('./routes/preconditions/setParentOfContent'),
        authorize = require('./routes/preconditions/authorization'),
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

    app.get('/token', [authorize, routes.token.get]);
    app.get('/token/new', [authorize, authenticate, routes.token.getNew]);

    app.post('/content', [authorize, authenticate, setParentOfContent, permissionsByNode.requireAuthor, routes.content.create]);
    app.post('/content/query', [authorize, authenticate, permissions.requireReader, routes.content.query]);
    app.put('/content/:id', [authorize, authenticate, setParentOfContent, permissionsByNode.requireAuthor, routes.content.update]);
    app.get('/content/:id', [authorize, authenticate, setParentOfContent, permissionsByNode.requireReader, routes.content.getById]);
    app.del('/content/:id', [authorize, authenticate, setParentOfContent, permissionsByNode.requireAuthor, routes.content.deleteById]);


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
    app.post('/users/query', [authorize, authenticate, permissions.requireAdmin, routes.users.query]);

    app.get('/node/:nodeid/children', [authorize, authenticate, setParentOfNode, permissionsByNode.requireReader, routes.nodes.getChildNodes]);
    app.get('/node/:nodeid/children/deep', [authorize, authenticate, setParentOfNode, permissionsByNode.requireReader, routes.nodes.getChildNodesDeep]);
    app.get('/node/:nodeid/assets/deep', [authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.getAssetsDeep]);
    app.get('/node/:nodeid/deep', [authorize, authenticate, setParentOfNode, permissionsByNode.requireReader, routes.nodes.getByIdDeep]);
    app.get('/node/:nodeid/assets', [authorize, authenticate, setParentOfNode, permissionsByNode.requireReader, routes.nodes.getAssets]);
    app.post('/node/:nodeid/assets/copy', [authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.copyAsset]);
    app.post('/node/:nodeid/assets/move', [authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.moveAsset]);
    app.post('/node/:nodeid/assets/rename', [authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.renameAsset]);
    app.del('/node/:nodeid/assets/:filename', [authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.deleteAsset]);
    app.del('/node/:nodeid/assets', [authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.deleteAllAssets]);
    app.post('/node/:nodeid/assets',[authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.attachAsset]);
    app.get('/node/:nodeid', [authorize, authenticate, setParentOfNode, permissionsByNode.requireReader, routes.nodes.getById]);
    app.del('/node/:nodeid', [authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.deleteNodeById]);

    app.post('/node', [authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.create]);
    app.post('/node/:nodeid/contenttype', [authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.addContentTypes]);
    app.post('/nodes', [authorize, authenticate, setParentOfNode, permissionsByNode.requireEditor, routes.nodes.create]);

    app.get('/contenttypes',  [authorize, authenticate, permissions.requireAdmin, routes.contentTypes.getList]);
    app.get('/contenttypes/:id', [authorize, authenticate, permissions.requireAdmin, routes.contentTypes.getById]);
    app.delete('/contenttypes/:id',  [authorize, authenticate, permissions.requireAdmin, routes.contentTypes.deleteById]);
    app.put('/contenttypes',  [authorize, authenticate, permissions.requireAdmin, routes.contentTypes.update]);
    app.post('/contenttypes',  [authorize, authenticate, permissions.requireAdmin, routes.contentTypes.create]);

};