/**
 * The couchdb module implements all of the operations needed to interface our cms with couch db.
 * @param config Database configuration values.
 * @returns {{}}
 */
module.exports = function initCouch(config){
    "use strict";

    var LOGGING_CATEGORY = 'MONGO-DRIVER',
        CONNECTION_URL = '',
        COLLECTION_NAME = 'users',
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
                    callback.call(this, err);
                    return;
                }

                var collection = db.collection(COLLECTION_NAME);
                var user = collection.findOne({_id: id}, function(err, doc) {
                    if(err) {
                        callback.call(this, err);
                        return;
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

    /**
     * CRUD operation to create a new document into a user collection.
     * @param userObj
     * @param callback
     */
    db.createUser = function(userObj, callback){
        try {
            client.connect(CONNECTION_URL, function(err, db) {
                if(err) {
                    internal.app.log.error(LOGGING_CATEGORY, err.stack);
                    callback.call(this, err);
                    return;
                }

                var collection = db.collection(COLLECTION_NAME);
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

    /**
     * CRUD operation to update the user in a collection.
     * @param userObj
     * @param callback
     */
    db.updateUser = function(userObj, callback){
        try {
            client.connect(CONNECTION_URL, function(err, db) {
                if(err) {
                    internal.app.log.error(LOGGING_CATEGORY, err.stack);
                    callback.call(this, err);
                    return;
                }

                if(userObj._id == null) {
                    callback.call(this, new Error("User ID not supplied. Cannot update."));
                }
                else {
                    db.collection(COLLECTION_NAME).update({ _id: userObj._id }, userObj, {safe:true}, function(err) {
                        if(err) {
                            internal.app.log.error(LOGGING_CATEGORY, err.stack);
                            callback.call(this, err);
                        }
                        else {
                            callback.call(this, null);
                        }
                    });
                }
            });
        }
        catch(ex){
            callback.call(this, ex);
        }

    };

    db.deleteUserById = function(){};

    db.getContentTypes = function(){

    };

    db.getContentTypeById = function(){

    };

    return db;
};

