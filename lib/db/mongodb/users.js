module.exports = function initMongoUsers(config){
    "use strict";

    var db = {},
        LOGGING_CATEGORY = 'MONGO-DRIVER-USERS',
        COLLECTION_NAME = 'users',
        client = config.client,
        internal = {},
        CONNECTION_URL = config.url;

    internal.config = config

    /**
     * Method that will return a user by their id
     * @param id
     * @param callback
     */
    db.getById = function(id, callback) {
        try {
            client.connect(CONNECTION_URL, function(err, db) {
                if(err) {
                    internal.app.log.error(LOGGING_CATEGORY, err.stack);
                    callback.call(this, err);
                    return;
                }

                db.collection(COLLECTION_NAME).findOne({_id: id}, function(err, doc) {
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

    db.getByLogin = function(login, callback) {
        try {
            client.connect(CONNECTION_URL, function(err, db) {
                if(err) {
                    internal.app.log.error(LOGGING_CATEGORY, err.stack);
                    callback.call(this, err);
                    return;
                }

                db.collection(COLLECTION_NAME).findOne({"login": login}, function(err, doc) {
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
            client.connect(CONNECTION_URL, function(err, db) {
                if(err) {
                    internal.app.log.error(LOGGING_CATEGORY, err.stack);
                    callback.call(this, err);
                    return;
                }

                db.collection(COLLECTION_NAME).findOne({"email": email}, function(err, doc) {
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
        try {
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
    db.update = function(userObj, callback){
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

    /**
     * CRUD method to delete a user by ID. Typically we don't delete data from the db. We just disable it.
     * @param userId
     * @param callback
     */
    db.deleteById = function(userId, callback){
        try {
            client.connect(CONNECTION_URL, function(err, db) {
                if(err) {
                    internal.app.log.error(LOGGING_CATEGORY, err.stack);
                    callback.call(this, err);
                    return;
                }

                if(userId == null || userId == '') {
                    callback.call(this, new Error("User ID not supplied. Cannot update."));
                }
                else {
                    db.collection(COLLECTION_NAME).remove({ _id: userId }, 1, function(err) {
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

    return db;
};
