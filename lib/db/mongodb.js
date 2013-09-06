/**
 * The couchdb module implements all of the operations needed to interface our cms with couch db.
 * @param config Database configuration values.
 * @returns {{}}
 */
module.exports = function initCouch(config){
    "use strict";

    var LOGGING_CATEGORY = 'MONGO-DRIVER',
        CONNECTION_URL = '',
        mongo = require('mongodb'),
        http = require('http'),
        url = require('url'),
        db = {},
        internal = {};

    internal.config = config;

    function log(data) {
        internal.app.log.info(LOGGING_CATEGORY, data);
    }

    /**
     * The public init method binds the application to the db object as well as creates and validates the authentication
     * cookie for couch db.
     * @param app App object with references to our db, logging and caching modules.
     */
    db.init = function(app, callback){
        internal.app = app;

        CONNECTION_URL = config.host.replace('{dbuser}', config.username).replace('{dbpassword}', config.password);

        if(callback){
            //This is required to be async for the event emmitter to work properly
            setTimeout(function(){
                callback.call(this);
            },0);

        }
    };

    db.getUsers = function() {

    };

    db.addUser = function(userObj, callback){

        var client = mongo.MongoClient,
            format = require('util').format;

        client.connect('CONNECTION_URL', function(err, db) {
            if(err) {
                internal.app.log.error(LOGGING_CATEGORY, err.stack);
                throw err;
            }

            var collection = db.collection('users');
            collection.insert(userObj, function(err, docs) {
                if(err) {
                    internal.app.log.error(LOGGING_CATEGORY, err.stack);
                    throw err;
                }

                collection.count(function(err, count) {
                    internal.app.log.error(LOGGING_CATEGORY, format("count = %s", count));

                    if(callback){
                        callback.call(this);
                    }
                });
            });
        });
    };

    db.updateUser = function(){};
    db.deleteUser = function(){};

    db.getContentTypes = function(){

    };

    db.getContentTypeById = function(){

    };

    return db;
};

