/**
 * Main library entry point. The module will return a function. If you are using it inside of another project then you
 * should require in grasshopper and execute the function. If you are using GH as a standalone app then you should
 * execute bin/grasshopper-js
 *
 * @param proxy - Express app that you want to use to act as a proxy to the grasshopper api
 */
module.exports = function(proxy){
    var _ = require('underscore'),
        express = require('express'),
        bridgetown = require('bridgetown-api'),
        grasshopper = require('grasshopper-core'),
        setHeaders = require('./middleware/setHeaders'),
        server = (_.isUndefined(proxy)) ? express() : proxy,
        PORT = (process.argv.length == 3 && process.argv[2] !== 'test') ? process.argv[2] : (process.env.PORT || 3000),
        routePath = '*';

    //Configure grasshopper core
    grasshopper.configure(function () {
        this.config = require('./config');
    });

    //Setup bridgetown configuration
    bridgetown.configure(function(){
        this.validate.token(function(token){
            return grasshopper.request(token).users.current();
        });
    });

    //Configure Express App
    server.configure( function () {
        server.use(express.static(__dirname + '/public'));

        if(server.get('grasshopper route prefix')){
            routePath = server.get('grasshopper route prefix') + '/*';
        }

        //Set the global route params for the given application route.
        server.all(routePath, [setHeaders, express.logger('default'), express.methodOverride(), express.json(), express.urlencoded()]);

        //Load in API Routes
        require('./routes/token')(server);
        require('./routes/users')(server);
        require('./routes/contentTypes')(server);
        require('./routes/content')(server);
        require('./routes/nodes')(server);
    });

    //Only start a server if a proxy is not available.
    if(_.isUndefined(proxy)){
        server.listen(PORT);
        console.log('Listening on port ' + PORT + '...');
    }
};