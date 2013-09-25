var express = require('express'),
    app = express(),
    config = require('./config/configuration.json'),
    sdk = require('./grasshopper-sdk'),
    internalSdk = new sdk(require('./config/configuration')),
    grasshopper = null,
    LOGGING_CATEGORY = "EXPRESS_SERVICE",
    api = {},
    PORT = process.env.PORT || 3000;

app.configure( function () {
    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
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

    app.get('/token', api.token.get);
    app.get('/contentTypes', api.contentTypes.getList);
    app.get('/contentTypes/:id', api.contentTypes.getById);
    app.get('/users/:id', api.users.getById);
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
