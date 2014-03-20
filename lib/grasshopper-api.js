var express = require('express'),
    bridgetown = require('bridgetown-api'),
    tokens = require('./entities/tokens'),
    app = express(),
    PORT = (process.argv.length == 3 && process.argv[2] !== 'test') ? process.argv[2] : (process.env.PORT || 3000);

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

    //Load in the Database
    require('./db');

    //Load in API Routes
    require('./api/routes/token')(app);
    require('./api/routes/users')(app);
    require('./api/routes/contentTypes')(app);
    require('./api/routes/content')(app);
    require('./api/routes/nodes')(app);

    bridgetown.configure(function(){
        this.validate.token(tokens.validate);
    });
});

app.listen(PORT);
console.log('Listening on port ' + PORT + '...');
