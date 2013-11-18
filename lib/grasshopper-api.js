var Permissions = require('./api/permissions'),
    Api = require('./api'),
    auth = require('./api/authentication'),
    permissions = new Permissions(),
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


app.get('/token', api.token.get);

app.post('/content', [auth, permissions.requireAuthor, _api.proxy('content').create]);
app.put('/content/:id', [auth, permissions.requireAuthor, _api.proxy('content').update]);
app.get('/content/:id', [auth, permissions.requireReader, _api.proxy('content').getById]);
app.del('/content/:id', [auth, permissions.requireAuthor, _api.proxy('content').deleteById]);


app.get('/users/:id', [auth, permissions.requireAdmin, _api.proxy('users').getById]);
app.delete('/users/:id', [auth, permissions.requireAdmin, _api.proxy('users').deleteById]);
app.delete('/users/:id/permissions/:nodeid', [auth, permissions.requireAdmin, _api.proxy('users').deletePermission]);

app.put('/users', [auth, permissions.requireAdmin, _api.proxy('users').update]);
app.put('/user', [auth, permissions.requireAdminOrSelf, _api.proxy('users').update]);
app.put('/users/:id', [auth, permissions.requireAdminOrSelf, _api.proxy('users').update]);
app.post('/users/:id/permissions', [auth, permissions.requireAdmin, _api.proxy('users').updatePermission]);
app.get('/users', [auth, permissions.requireAdmin, _api.proxy('users').getList]);
app.get('/user', [auth, _api.proxy('users').getCurrentUser]);
app.post('/users', [auth, permissions.requireAdmin, _api.proxy('users').create]);


app.get('/node/:id/children', api.nodes.getChildNodes);
app.get('/node/:id/children/deep', api.nodes.getChildNodesDeep);
app.get('/node/:id/assets/deep', api.nodes.getAssetsDeep);
app.get('/node/:id/deep', api.nodes.getByIdDeep);
app.get('/node/:id/assets', api.nodes.getAssets);
app.post('/node/:id/assets/copy', api.nodes.copyAsset);
app.post('/node/:id/assets/move', api.nodes.moveAsset);
app.post('/node/:id/assets/rename', api.nodes.renameAsset);
app.del('/node/:id/assets/:filename', api.nodes.deleteAsset);
app.del('/node/:id/assets', api.nodes.deleteAllAssets);
app.post('/node/:id/assets', api.nodes.attachAsset);
app.get('/node/:id', api.nodes.getById);
app.del('/node/:id', api.nodes.deleteNodeById);

app.post('/node', api.nodes.create);
app.post('/node/:id/contenttype', api.nodes.addContentTypes);
app.post('/nodes', api.nodes.create);

app.get('/contenttypes',  [auth, permissions.requireAdmin, _api.proxy('contentTypes').getList]);
app.get('/contenttypes/:id', [auth, permissions.requireAdmin, _api.proxy('contentTypes').getById]);
app.delete('/contenttypes/:id',  [auth, permissions.requireAdmin, _api.proxy('contentTypes').deleteById]);
app.put('/contenttypes',  [auth, permissions.requireAdmin, _api.proxy('contentTypes').update]);
app.post('/contenttypes',  [auth, permissions.requireAdmin, _api.proxy('contentTypes').create]);

app.listen(PORT);
console.log('Listening on port ' + PORT + '...');
