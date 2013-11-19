var express = require('express'),
    mongoose = require('mongoose'),
    config = require('./config'),
    db = require('./db'),
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

    //Load in Routes
    require('./api')(app);
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

app.listen(PORT);
console.log('Listening on port ' + PORT + '...');
