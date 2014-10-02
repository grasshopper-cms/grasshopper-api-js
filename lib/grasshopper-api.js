/**
 * Main library entry point. The module will return a function. If you are using it inside of another project then you
 * should require in grasshopper and execute the function. If you are using GH as a standalone app then you should
 * execute bin/grasshopper-js
 *
 * @param proxy - Express app that you want to use to act as a proxy to the grasshopper api
 */
module.exports = function(options){
    'use strict';

    var fs = require('fs'),
        http = require('http'),
        https = require('https'),
        morgan = require('morgan'),
        express = require('express'),
        bodyParser = require('body-parser'),
        bridgetown = require('bridgetown-api'),
        grasshopper = require('grasshopper-core').init(options),
        methodOverride = require('method-override'),
        setHeaders = require('./middleware/setHeaders'),
        ghapiRouter = express.Router(),
        PORT = (process.argv.length == 3 && process.argv[2] !== 'test') ? process.argv[2] : (process.env.PORT || 3000),
        bodyParserLimit = false,
        serverOptions = {},
        ssl = false,
        useProxy = false,
        expressApp,
        routePath;

    if (options && options.bodyParser && options.bodyParser.limit) {
        bodyParserLimit = options.bodyParser.limit;
    }

    //Setup bridgetown configuration
    bridgetown.configure(function(){
        this.validate.token(function(authentication){
            return grasshopper.request(authentication.token).users.current();
        });
    });

    //Configure Express App
    ghapiRouter.use(express.static(__dirname + '/public'));

    //Set the global route params for the given application route.
    ghapiRouter.route('*').all([setHeaders, morgan('default'), methodOverride(), bodyParser( bodyParserLimit || {limit: '2mb'})]);

    if( grasshopper.config.server ) {
        if( grasshopper.config.server.https ) {
            serverOptions.key = fs.readFileSync(grasshopper.config.server.https.key);
            serverOptions.cert = fs.readFileSync(grasshopper.config.server.https.cert);
            ssl = true;
        }

        if( grasshopper.config.server.proxy === true ) {
            useProxy = true;
        }
    }

    //Load in API Routes
    require('./routes/token')(ghapiRouter);
    require('./routes/google')(ghapiRouter);
    require('./routes/users')(ghapiRouter);
    require('./routes/contentTypes')(ghapiRouter);
    require('./routes/content')(ghapiRouter);
    require('./routes/nodes')(ghapiRouter);
    require('./routes/system')(ghapiRouter);

    //Only start a server if a proxy is not available.
    if(!useProxy){

        expressApp = express();
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
        router : ghapiRouter,
        core : grasshopper
    };
};
