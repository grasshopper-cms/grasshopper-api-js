module.exports = function(config){
    "use strict";

    var db = {},
        driver = {
            collection: 'nodes',
            loggingCategory: 'MONGO-DRIVER-NODES',
            client: config.client,
            url: config.url,
            log: config.log
        },
        mongo = require('./crud')(driver),
        internal = {};

    internal.config = config;

    /**
     * Method that will return a node by their id
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

    db.getBySlug = function(slug, callback) {
        try {
            driver.client.connect(driver.url, function(err, db) {
                if(err) {
                    driver.log.error(driver.loggingCategory, err.stack);
                    callback(err);
                    return;
                }

                db.collection(driver.collection).findOne({"slug": slug}, function(err, doc) {
                    if(err) {
                        callback(err);
                    }
                    else if (doc != null) {
                        callback(null, doc);
                    }
                    else {
                        callback(new Error("Node does not exist"));
                    }
                    db.close();
                });
            });
        }
        catch(ex){
            callback(ex);
        }
    };

    /**
     * CRUD operation to create a new document into a node collection.
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
     * CRUD operation to update the node in a collection.
     * @param obj
     * @param callback
     */
    db.update = function(obj, callback){
        mongo.update(obj, function(err, doc){
            if(err) {
                callback(err);
                return;
            }
            callback(null, doc);
        });
    };

    /**
     * CRUD method to delete a node by ID. Typically we don't delete data from the db. We just disable it.
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
                    if(err) {
                        callback(err);
                    }
                    else if (docs != null) {
                        callback(null, docs);
                    }

                    db.close();
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

            db.collection(driver.collection, function(err, collection) {
                collection.aggregate([
                    {$group : {
                        '_id' : "count",
                        'count' : {$sum : 1}
                    }}],
                    function (err, items){
                        callback(err, items);
                        db.close();
                    });
            });
        });
    };

    return db;
};
