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
        internal = {},
        fieldExclusions = {
            password: 0
        };

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

    db.getByLogin = function(login, callback) {
        try {
            driver.client.connect(driver.url, function(err, db) {
                if(err) {
                    driver.log.error(driver.loggingCategory, err.stack);
                    callback(err);
                    return;
                }

                db.collection(driver.collection).findOne({"login": login}, function(err, doc) {
                    if(err) {
                        callback(err);
                    }
                    else if (doc != null) {
                        callback(null, doc);
                    }
                    else {
                        callback(new Error("User does not exist"));
                    }
                });
            });
        }
        catch(ex){
            callback(ex);
        }
    };

    db.getByEmail = function(email, callback) {
        try {
            driver.client.connect(driver.url, function(err, db) {
                if(err) {
                    driver.log.error(driver.loggingCategory, err.stack);
                    callback(err);
                    return;
                }

                db.collection(driver.collection).findOne({"email": email}, function(err, doc) {
                    if(err) {
                        callback(err);
                    }
                    else if (doc != null) {
                        callback(null, doc);
                    }
                    else {
                        callback(new Error("User does not exist"));
                    }
                });
            });
        }
        catch(ex){
            callback(ex);
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
                callback(err);
                return;
            }
            callback(null, doc);
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

    db.list = function (options, callback){
        driver.client.connect(driver.url, function(err, db) {
            if(err) {
                driver.log.error(driver.loggingCategory, err.stack);
                callback(err);
                return;
            }

            db.collection(driver.collection).find({}, fieldExclusions, {
                limit: options.limit,
                skip: options.skip
            }).toArray(function(err, docs) {
                console.log(err);
                console.log(docs);
                if(err) {
                    callback(err);
                }
                else if (docs != null) {
                    callback(null, docs);
                }
            });

        });
    };

    db.describe = function (options, callback){
        driver.client.connect(driver.url, function(err, db) {
            if(err) {
                driver.log.error(driver.loggingCategory, err.stack);
                callback(err);
                return;
            }

            /*db.collection(driver.collection, function(err, collection) {
                collection.aggregate([
                    {$group : {
                        '_id' : {'time' :'$time', 'url' : '$url', 'ip' : '$ip'},
                        'count' : {$sum : 1}
                    }}],
                    function (err, items){
                        // logic
                    });
            });*/
        });
    };

    return db;
};
