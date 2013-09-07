/**
 * The couchdb module implements all of the operations needed to interface our cms with couch db.
 * @param config Database configuration values.
 * @returns {{}}
 */
module.exports = function initCouch(config){
    "use strict";

    var LOGGING_CATEGORY = 'MONGO-DRIVER',
        CONNECTION_URL = '',
        client = require('mongodb').MongoClient,
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
                //The 2nd parameter is always here for errors.
                callback.call(this, null);
            },0);

        }
    };

    db.getUserById = function(id, callback) {
        try {
            client.connect(CONNECTION_URL, function(err, db) {
                if(err) {
                    internal.app.log.error(LOGGING_CATEGORY, err.stack);
                    throw err;
                }

                var collection = db.collection('users');
                var user = collection.findOne({_id: id}, function(err, doc) {
                    if(err) {
                        internal.app.log.error(LOGGING_CATEGORY, err.stack);
                        throw err;
                    }
                    console.log(doc);
                    //if(docs.length > 0){
                    //    callback.call(this, null, docs[0]);
                    //}

                });
            });
        }
        catch(ex){
            callback.call(this, ex);
        }
    };

    db.addUser = function(userObj, callback){

        try {
            client.connect(CONNECTION_URL, function(err, db) {
                if(err) {
                    internal.app.log.error(LOGGING_CATEGORY, err.stack);
                    callback.call(this, err);
                    return;
                }

                var collection = db.collection('users');
                collection.insert(userObj, function(err, docs) {
                    if(err) {
                        internal.app.log.error(LOGGING_CATEGORY, err.stack);
                        callback.call(this, err);
                        return;
                    }

                    if(docs.length > 0){
                        callback.call(this, null, docs[0]);
                    }

                });
            });
        }
        catch(ex){
            callback.call(this, ex);
        }

    };

    db.updateUser = function(){};
    db.deleteUser = function(){};

    db.getContentTypes = function(){

    };

    db.getContentTypeById = function(){

    };

    return db;
};

