var express = require('express'),
    mongoose = require('mongoose'),
    config = require('./config'),
    db = require('./db'),
    api = {
        token: require('./api/token'),
        users: require('./api/users'),
        nodes: require('./api/nodes'),
        contentTypes: require('./api/contentTypes')
    },
    url =  config.db.host,
    options = {
        user: config.db.username,
        pass: config.db.password
    },
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

app.get('/users/:id', api.users.getById);
app.delete('/users/:id', api.users.deleteById);
app.delete('/users/:id/permissions/:nodeid', api.users.deletePermission);

app.put('/users', api.users.update);
app.put('/user', api.users.update);
app.put('/users/:id', api.users.update);
app.post('/users/:id/permissions', api.users.updatePermission);
app.get('/users', api.users.getList);
app.get('/user', api.users.getCurrentUser);
app.post('/users', api.users.create);


app.get('/node/:id*/children', api.nodes.getChildNodes);
app.get('/node/:id*/children/deep', api.nodes.getChildNodesDeep);
app.get('/node/:id*/assets/deep', api.nodes.getFilesDeep);
app.get('/node/:id*/deep', api.nodes.getByIdDeep);
app.get('/node/:id*/assets', api.nodes.getFiles);
app.post('/node/:id*/assets', api.nodes.attachFile);
app.get('/node/:id*', api.nodes.getById);

app.post('/node', api.nodes.create);
app.post('/node/:id/contenttype', api.nodes.addContentTypes);
app.post('/nodes', api.nodes.create);

app.get('/contenttypes', api.contentTypes.getList);
app.get('/contenttypes/:id', api.contentTypes.getById);
app.delete('/contenttypes/:id', api.contentTypes.deleteById);
app.put('/contenttypes', api.contentTypes.update);
app.post('/contenttypes', api.contentTypes.create);

app.listen(PORT);
console.log('Listening on port ' + PORT + '...');
