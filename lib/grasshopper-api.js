var express = require('express'),
    app = express(),
    config = require('./config/configuration.json'),
    sdk = require('./grasshopper-sdk'),
    internalSdk = new sdk(require('./config/configuration')),
    grasshopper = null,
    LOGGING_CATEGORY = "EXPRESS_SERVICE",
    api = {};

app.configure( function () {
    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return next();
    });
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

internalSdk.on('ready', function(val){
    grasshopper = val;
    api.token = require('./api/token')(grasshopper);
    api.users = require('./api/users')(grasshopper);

    app.get('/token', api.token.get);
    app.get('/users/:id', api.users.getById);
    grasshopper.log.info(LOGGING_CATEGORY, "GRASSHOPPER SDK LOADED!!!!!!!!!!");
});

internalSdk.on('failed', function(err){
    console.log("Could not load grasshopper.");
    console.log(err);
});

app.listen(3000);
console.log('Listening on port 3000...');
