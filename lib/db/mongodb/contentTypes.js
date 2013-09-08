module.exports = function initMongoContentTypes(config){
    "use strict";

    var db = {},
        LOGGING_CATEGORY = 'MONGO-DRIVER-CONTENT-TYPES',
        COLLECTION_NAME = 'contentTypes',
        client = config.client,
        internal = {},
        CONNECTION_URL = config.url;

    internal.config = config;

    /**
     * Method that will return a content type by it's id
     * @param id
     * @param callback
     */
    db.getById = function(id, callback) {
        client.connect(CONNECTION_URL, function(err, database) {
            if(err) {
                internal.app.log.error(LOGGING_CATEGORY, err.stack);
                callback.call(this, err);
            }
            else {
                database.collection(COLLECTION_NAME).findOne({_id: id}, function(err, doc) {
                    if(err) {
                        internal.app.log.error(LOGGING_CATEGORY, err.stack);
                        callback.call(this, err);
                    }
                    else if (doc != null) {
                        callback.call(this, null, doc);
                    }
                    else {
                        callback.call(this, new Error("ContentType does not exist"));
                    }
                });
            }
        });
    };

    db.create = function(userObj, callback){

        client.connect(CONNECTION_URL, function(err, db) {
            if(err) {
                internal.app.log.error(LOGGING_CATEGORY, err.stack);
                callback.call(this, err);
                return;
            }

            db.collection(COLLECTION_NAME).insert(userObj, function(err, docs) {
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

    };

    return db;
};
