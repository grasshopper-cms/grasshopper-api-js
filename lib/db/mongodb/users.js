module.exports = function initMongoUsers(config){
    "use strict";

    var db = {},
        driver = {
            collection: 'users',
            loggingCategory: 'MONGO-DRIVER-USERS',
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
                callback.call(this, err);
                return;
            }
            callback.call(this, null, doc);
        });
    };

    db.getByLogin = function(login, callback) {
        try {
            driver.client.connect(driver.url, function(err, db) {
                if(err) {
                    driver.log.error(driver.loggingCategory, err.stack);
                    callback.call(this, err);
                    return;
                }

                db.collection(driver.collection).findOne({"login": login}, function(err, doc) {
                    if(err) {
                        callback.call(this, err);
                    }
                    else if (doc != null) {
                        callback.call(this, null, doc);
                    }
                    else {
                        callback.call(this, new Error("User does not exist"));
                    }
                });
            });
        }
        catch(ex){
            callback.call(this, ex);
        }
    };

    db.getByEmail = function(email, callback) {
        try {
            driver.client.connect(driver.url, function(err, db) {
                if(err) {
                    driver.log.error(driver.loggingCategory, err.stack);
                    callback.call(this, err);
                    return;
                }

                db.collection(driver.collection).findOne({"email": email}, function(err, doc) {
                    if(err) {
                        callback.call(this, err);
                    }
                    else if (doc != null) {
                        callback.call(this, null, doc);
                    }
                    else {
                        callback.call(this, new Error("User does not exist"));
                    }
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
    db.create = function(userObj, callback){
        mongo.create(userObj, function(err, doc){
            if(err) {
                callback.call(this, err);
                return;
            }
            callback.call(this, null, doc);
        });
    };

    /**
     * CRUD operation to update the user in a collection.
     * @param userObj
     * @param callback
     */
    db.update = function(userObj, callback){
        mongo.update(userObj, function(err, doc){
            if(err) {
                callback.call(this, err);
                return;
            }
            callback.call(this, null, doc);
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
                callback.call(this, err);
                return;
            }
            callback.call(this, null, doc);
        });
    };

    return db;
};
