/**
 * The mongodb module implements all of the operations needed to interface our cms with mongo.
 * @param config Database configuration values.
 * @returns {{}}
 */
module.exports = function initMongo(config){
    "use strict";

    var LOGGING_CATEGORY = 'MONGO-DRIVER',
        client = require('mongodb').MongoClient,
        mongoose = require( 'mongoose' ),
        db = {},
        internal = {};

    internal.config = config;

    function log(data) {
        internal.app.log.info(LOGGING_CATEGORY, data);
        console.log(data);
    }

    /**
     * The public init method binds the application to the db object.
     * @param app App object with references to our db, logging and caching modules.
     */
    db.init = function(app, callback){
        internal.app = app;

        var conf = {
            "url" : config.host.replace('{dbuser}', config.username).replace('{dbpassword}', config.password),
            "client" : client,
            "log" : internal.app.log
        };

        db.tokens = require('./mongodb/tokens')(conf);
        db.users = require('./mongodb/users');
        db.contentTypes = require('./mongodb/contentTypes')(conf);

        mongoose.connect(conf.url);

        // When successfully connected
        mongoose.connection.on('connected', function () {
            log('Connection made to mongo database.');

            if(callback){
                callback.call(this, null);
            }
        });

        // If the connection throws an error
        mongoose.connection.on('error',function (err) {
            log('Mongoose default connection error: ' + err);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', function () {
            log('Mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', function() {
            mongoose.connection.close(function () {
                log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
    };

    return db;
};

