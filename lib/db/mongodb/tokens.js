module.exports = function(config){
    "use strict";

    var db = {},
        driver = {
            collection: 'tokens',
            loggingCategory: 'MONGO-DRIVER-TOKENS',
            client: config.client,
            url: config.url,
            log: config.log
        },
        mongo = require('./crud')(driver),
        internal = {};

    internal.config = config;
    /**
     * Method that will return a token by it's id
     * @param id
     * @param callback
     */
    db.getById = function(id, callback) {
        mongo.getById(id, function(err, doc){
            if(err) {
                callback(err);
                return;
            }
            callback(null, doc);
        });
    };

    /**
     * CRUD operation to create a new document into a token collection.
     * @param obj
     * @param callback
     */
    db.create = function(obj, callback){
        mongo.create(obj, function(err, doc){
            if(err) {
                callback(err);
                return;
            }
            callback(null, doc);
        });
    };

    /**
     * CRUD method to delete by ID.
     * @param id
     * @param callback
     */
    db.deleteById = function(id, callback){
        mongo.deleteById(id, function(err, doc){
            if(err) {
                callback(err);
                return;
            }
            callback(null, doc);
        });
    };

    return db;
};
