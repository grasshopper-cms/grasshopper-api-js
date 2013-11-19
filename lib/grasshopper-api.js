var Permissions = require('./api/security/permissions/global'),
    PermissionsByNode = require('./api/security/permissions/node'),
    resolveParentNodeId = require('./api/security/resolveparent'),
    Api = require('./api'),
    authorize = require('./api/security/authorization'),
    authenticate = require('./api/security/authentication'),
    resolveParentNodeId = require('./api/security/resolveparent'),
    permissions = new Permissions(),
    permissionsByNode = new PermissionsByNode(),
    express = require('express'),
    mongoose = require('mongoose'),
    config = require('./config'),
    db = require('./db'),
    api = {
        token: require('./api/token'),
        nodes: require('./api/nodes')
    },
    url =  config.db.host,
    options = {
        user: config.db.username,
        pass: config.db.password
    },
    _api = new Api(),
    app = express(),
    PORT = process.env.PORT || 3000;

app.configure( function () {
    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        return next();
    });
    app.use(express.logger('dev'));
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
});

mongoose.connect(url, options);

// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Connection made to mongo database.');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


app.get('/token', [authorize, _api.proxy('token').get]);

app.post('/content/:nodeid', [authorize, authenticate, permissions.requireAuthor, _api.proxy('content').create]);
app.put('/content/:nodeid/:id', [authorize, authenticate, permissions.requireAuthor, _api.proxy('content').update]);
app.get('/content/:nodeid/:id', [authorize, authenticate, permissions.requireReader, _api.proxy('content').getById]);
app.del('/content/:nodeid/:id', [authorize, authenticate, permissions.requireAuthor, _api.proxy('content').deleteById]);


app.get('/users/:id', [authorize, authenticate, permissions.requireAdmin, _api.proxy('users').getById]);
app.delete('/users/:id', [authorize, authenticate, permissions.requireAdmin, _api.proxy('users').deleteById]);
app.delete('/users/:id/permissions/:nodeid', [authorize, authenticate, permissions.requireAdmin, _api.proxy('users').deletePermission]);

app.put('/users', [authorize, authenticate, permissions.requireAdmin, _api.proxy('users').update]);
app.put('/user', [authorize, authenticate, permissions.requireAdminOrSelf, _api.proxy('users').update]);
app.put('/users/:id', [authorize, authenticate, permissions.requireAdminOrSelf, _api.proxy('users').update]);
app.post('/users/:id/permissions', [authorize, authenticate, permissions.requireAdmin, _api.proxy('users').updatePermission]);
app.get('/users', [authorize, authenticate, permissions.requireAdmin, _api.proxy('users').getList]);
app.get('/user', [authorize, authenticate, _api.proxy('users').getCurrentUser]);
app.post('/users', [authorize, authenticate, permissions.requireAdmin, _api.proxy('users').create]);


app.get('/node/:nodeid/children', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireReader, _api.proxy('nodes').getChildNodes]);
app.get('/node/:nodeid/children/deep', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireReader, _api.proxy('nodes').getChildNodesDeep]);
app.get('/node/:nodeid/assets/deep', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').getAssetsDeep]);
app.get('/node/:nodeid/deep', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireReader, _api.proxy('nodes').getByIdDeep]);
app.get('/node/:nodeid/assets', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireReader,_api.proxy('nodes').getAssets]);
app.post('/node/:nodeid/assets/copy', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').copyAsset]);
app.post('/node/:nodeid/assets/move', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').moveAsset]);
app.post('/node/:nodeid/assets/rename', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').renameAsset]);
app.del('/node/:nodeid/assets/:filename', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').deleteAsset]);
app.del('/node/:nodeid/assets', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').deleteAllAssets]);
app.post('/node/:nodeid/assets',[authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').attachAsset]);
app.get('/node/:nodeid', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireReader, _api.proxy('nodes').getById]);
app.del('/node/:nodeid', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').deleteNodeById]);

app.post('/node', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').create]);
app.post('/node/:nodeid/contenttype', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').addContentTypes]);
app.post('/nodes', [authorize, authenticate, resolveParentNodeId, permissionsByNode.requireEditor, _api.proxy('nodes').create]);

app.get('/contenttypes',  [authorize, authenticate, permissions.requireAdmin, _api.proxy('contentTypes').getList]);
app.get('/contenttypes/:id', [authorize, authenticate, permissions.requireAdmin, _api.proxy('contentTypes').getById]);
app.delete('/contenttypes/:id',  [authorize, authenticate, permissions.requireAdmin, _api.proxy('contentTypes').deleteById]);
app.put('/contenttypes',  [authorize, authenticate, permissions.requireAdmin, _api.proxy('contentTypes').update]);
app.post('/contenttypes',  [authorize, authenticate, permissions.requireAdmin, _api.proxy('contentTypes').create]);

app.listen(PORT);
console.log('Listening on port ' + PORT + '...');
