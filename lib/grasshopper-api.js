

module.exports = function(proxy){
    var _ = require('underscore'),
        express = require('express'),
        bridgetown = require('bridgetown-api'),
        tokens = require('./entities/tokens'),
        setHeaders = require('./api/middleware/setHeaders'),
        server = (_.isUndefined(proxy)) ? express() : proxy,
        routePath = '*',
        PORT = (process.argv.length == 3 && process.argv[2] !== 'test') ? process.argv[2] : (process.env.PORT || 3000);

    server.configure( function () {
        server.use(express.static(__dirname + '/public'));

        if(server.get('grasshopper route prefix')){
            routePath = server.get('grasshopper route prefix') + '/*';
        }

        //Set the global route params for the given application route.
        server.all(routePath, [setHeaders, express.logger('default'), express.methodOverride(), express.json(), express.urlencoded()]);

        //Load in the Database
        require('./db');

        //Load in API Routes
        require('./api/routes/token')(server);
        require('./api/routes/users')(server);
        require('./api/routes/contentTypes')(server);
        require('./api/routes/content')(server);
        require('./api/routes/nodes')(server);

        bridgetown.configure(function(){
            this.validate.token(tokens.validate);
        });
    });

    //Only start a server if a proxy is not available.
    if(_.isUndefined(proxy)){
        server.listen(PORT);
        console.log('Listening on port ' + PORT + '...');
    }
};