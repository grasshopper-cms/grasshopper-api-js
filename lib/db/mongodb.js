/**
 * The mongodb module implements all of the operations needed to interface our cms with mongo.
 * @param config Database configuration values.
 * @returns {{}}
 */
module.exports = function initMongo(config){
    "use strict";

    var LOGGING_CATEGORY = 'MONGO-DRIVER',
        client = require('mongodb').MongoClient,
        db = {},
        internal = {};

    internal.config = config;

    function log(data) {
        internal.app.log.info(LOGGING_CATEGORY, data);
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
        db.users = require('./mongodb/users')(conf);
        db.contentTypes = require('./mongodb/contentTypes')(conf);

        if(callback){
            //This is required to be async for the event emmitter to work properly
            setTimeout(function(){
                //The 2nd parameter is always here for errors.
                callback.call(this, null);
            },0);
        }
    };

    return db;
};

