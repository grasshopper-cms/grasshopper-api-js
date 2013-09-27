module.exports = function initMongoUsers(config){
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
     * Method that will return a user by their id
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
     * CRUD operation to create a new document into a user collection.
     * @param userObj
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
     * CRUD method to delete a user by ID. Typically we don't delete data from the db. We just disable it.
     * @param userId
     * @param callback
     */
    db.deleteById = function(userId, callback){
        mongo.deleteById(userId, function(err, doc){
            if(err) {
                callback(err);
                return;
            }
            callback(null, doc);
        });
    };

    return db;
};
