module.exports = function initMongoCrudMethods(config){
    "use strict";

    var db = {},
        CONNECTION_URL   = config.url,
        LOGGING_CATEGORY = config.loggingCategory,
        COLLECTION_NAME  = config.collection,
        client           = config.client,
        log              = config.log,
        ObjectID         = require('mongodb').ObjectID;

    function buildError(message){
        log.error(LOGGING_CATEGORY, message);
        return new Error(message);
    }

    function buildId(id){
        var mongoId = id;

        //If the passed in value is a mongo id then create a valid ObjectID. Not doing this will result in matches not being returned.
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            mongoId = new ObjectID(id);
        }

        return mongoId;
    }

    db.getById = function(id, callback) {
        client.connect(CONNECTION_URL, function(err, database) {
            if(err) {
                log.error(LOGGING_CATEGORY, err.stack);
                callback(err);
                return;
            }

            database.collection(COLLECTION_NAME).findOne({_id: buildId(id) }, function(err, doc) {
                if(err) {
                    log.error(LOGGING_CATEGORY, err.stack);
                    callback(err);
                }
                else if (doc != null) {
                    callback(null, doc);
                }
                else {
                    callback(buildError("[404] getById:" + COLLECTION_NAME + ": '" + id + "' could not be found."));
                }
            });
        });
    };

    db.create = function(obj, callback){
        client.connect(CONNECTION_URL, function(err, database) {
            if(err) {
                log.error(LOGGING_CATEGORY, err.stack);
                callback(err);
                return;
            }

            database.collection(COLLECTION_NAME).insert(obj, function(err, docs) {
                if(err) {
                    log.error(LOGGING_CATEGORY, err.stack);
                    callback(err);
                }
                else {
                    if(docs.length > 0){
                        callback(null, docs[0]);
                    }
                    else {
                        callback(buildError("Could not create: " + obj));
                    }
                }
            });
        });
    };

    db.update = function(obj, callback){
        client.connect(CONNECTION_URL, function(err, database) {
            if(err) {
                log.error(LOGGING_CATEGORY, err.stack);
                callback(err);
                return;
            }

            if(obj._id == null) {
                callback(buildError("update:" + COLLECTION_NAME + ": _id not supplied in content object. " + obj + " Cannot update."));
            }
            else {
                obj._id = buildId(obj._id);

                database.collection(COLLECTION_NAME).update({ _id: obj._id }, obj, {safe:true}, function(err) {
                    if(err) {
                        log.error(LOGGING_CATEGORY, err.stack);
                        callback(err);
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    };

    db.deleteById = function(id, callback){
        client.connect(CONNECTION_URL, function(err, db) {
            if(err) {
                log.error(LOGGING_CATEGORY, err.stack);
                callback(err);
                return;
            }

            if(id == null || id == '') {
                callback(buildError("deleteById:" + COLLECTION_NAME + ": _id not supplied in content object. Cannot update."));
            }
            else {
                db.collection(COLLECTION_NAME).remove({ _id: buildId(id) }, 1, function(err) {
                    if(err) {
                        log.error(LOGGING_CATEGORY, err.stack);
                        callback(err);
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    };

    return db;
};
