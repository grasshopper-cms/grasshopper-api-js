var express = require('express'),
    app = express(),
    sdk = require('./grasshopper-sdk'),
    internalSdk = new sdk(require((process.argv.length == 3 && process.argv[2] == 'test') ? './config/configuration.test' : './config/configuration')),
    grasshopper = null,
    LOGGING_CATEGORY = "EXPRESS_SERVICE",
    api = {},
    PORT = process.env.PORT || 3000;


app.configure( function () {
    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        return next();
    });
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

internalSdk.on('ready', function(val){
    grasshopper      = val;
    api.token        = require('./api/token')(grasshopper);
    api.users        = require('./api/users')(grasshopper);
    api.contentTypes = require('./api/contentTypes')(grasshopper);
    api.nodes        = require('./api/nodes')(grasshopper);

    app.get('/token', api.token.get);

    app.get('/node/:id', api.nodes.getById);
    app.post('/node', api.nodes.create);
    app.post('/nodes', api.nodes.create);

    app.get('/contentTypes', api.contentTypes.getList);
    app.get('/contentTypes/:id', api.contentTypes.getById);
    app.delete('/contentTypes/:id', api.contentTypes.deleteById);
    app.put('/contentTypes', api.contentTypes.update);
    app.post('/contentTypes', api.contentTypes.create);


    app.get('/users/:id', api.users.getById);
    app.delete('/users/:id', api.users.deleteById);
    app.put('/users', api.users.update);
    app.put('/user', api.users.update);
    app.put('/users/:id', api.users.update);
    app.get('/users', api.users.getList);
    app.get('/user', api.users.getCurrentUser);
    app.post('/users', api.users.create);


    grasshopper.log.info(LOGGING_CATEGORY, "GRASSHOPPER SDK LOADED!!!!!!!!!!");
});

internalSdk.on('failed', function(err){
    console.log("Could not load grasshopper.");
    console.log(err);
});

app.listen(PORT);
console.log('Listening on port ' + PORT + '...');
