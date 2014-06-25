/**
 * Main library entry point. The module will return a function. If you are using it inside of another project then you
 * should require in grasshopper and execute the function. If you are using GH as a standalone app then you should
 * execute bin/grasshopper-js
 *
 * @param proxy - Express app that you want to use to act as a proxy to the grasshopper api
 */
module.exports = function(proxy){
    'use strict';

    var _ = require('underscore'),
        express = require('express'),
        morgan = require('morgan'),
        methodOverride = require('method-override'),
        bodyParser = require('body-parser'),
        bridgetown = require('bridgetown-api'),
        fs = require('fs'),
        https = require('https'),
        http = require('http'),
        grasshopper = require('grasshopper-core'),
        setHeaders = require('./middleware/setHeaders'),
        getRawBody = require('raw-body'),
        config = require('./config'),
        expressApp = (_.isUndefined(proxy)) ? express() : proxy,
        ghapiRouter = express.Router(),
        serverOptions = {},
        routePath,
        PORT = (process.argv.length == 3 && process.argv[2] !== 'test') ? process.argv[2] : (process.env.PORT || 3000),
        ssl = false;

    //Configure grasshopper core
    grasshopper.configure(function () {
        this.config = config;
    });

    //Setup bridgetown configuration
    bridgetown.configure(function(){
        this.validate.token(function(token){
            return grasshopper.request(token).users.current();
        });
    });

    //Configure Express App
    ghapiRouter.use(express.static(__dirname + '/public'));



    //Set the global route params for the given application route.
    ghapiRouter.route('*').all([setHeaders, morgan('default'), methodOverride(), bodyParser()]);

    //Set the maximum upload size on the assets route.
    //routePath.replace('*', ':nodeid/assets'),
    ghapiRouter.use('node/:nodeid/assets', function (req, res, next) {
        getRawBody(req, {
            length: req.headers['content-length'],
            limit: '1000mb',
            encoding: 'utf8'
        }, function (err, string) {
            if (err){
                return next(err);
            }

            req.text = string;
            next();
        });
    });

    if( config.server ) {
        if( config.server.https ) {
            serverOptions.key = fs.readFileSync(config.server.https.key);
            serverOptions.cert = fs.readFileSync(config.server.https.cert);
            ssl = true;
        }
    }

    //Load in API Routes
    require('./routes/token')(ghapiRouter);
    require('./routes/users')(ghapiRouter);
    require('./routes/contentTypes')(ghapiRouter);
    require('./routes/content')(ghapiRouter);
    require('./routes/nodes')(ghapiRouter);
    require('./routes/system')(ghapiRouter);

    //Only start a server if a proxy is not available.
    if(_.isUndefined(proxy)){

        // Only setup router if no proxy if passed in
        // If there is a proxy, then assume the user will setup the router with their desired mount path when they see fit
        routePath = expressApp.get('grasshopper route prefix') || '/';
        expressApp.use(routePath, ghapiRouter);

        if(ssl) {
            https.createServer(serverOptions, expressApp).listen(PORT, function(){
                console.log('Listening securely on port ' + PORT + '...');
            });
        }
        else {
            http.createServer(expressApp).listen(PORT, function(){
                console.log('Listening on port ' + PORT + '...');
            });
        }

    }

    return {
        bridgetown : bridgetown,
        ghApi : ghapiRouter,
        ghCore : grasshopper
    };
};