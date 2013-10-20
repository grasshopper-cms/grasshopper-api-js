module.exports = function(app){
    "use strict";

    var users = {},
        internal = {},
        _ = require("underscore"),
        async = require("async"),
        LOGGING_CATEGORY = "GRASSHOPPER-USER";

    internal.app = app;

    /**
     * Method to be called when you want to create a user in the system.
     * When saving a user all mandatory fields will be checked.
     * @param userObj
     * @param callback
     */
    users.create = function(userObj, callback){
        internal.app.db.users.create(userObj, function(err, val){
            callback(err, val);
        });
    };

    users.getById = function(userId, callback){
        internal.app.db.users.getById(userId, function(err, val){
            callback(err, val);
        });
    };

    users.getByEmail = function(userEmail, callback){
        internal.app.db.users.getByEmail(userEmail, function(err, val){
            callback(err, val);
        });
    };

    users.getByLogin = function(userLogin, callback){
        internal.app.db.users.getByLogin(userLogin, function(err, val){
            callback(err, val);
        });
    };

    users.authenticate = function(userLogin, userPassword, callback){
        internal.app.db.users.authenticate(userLogin, userPassword, function(err, val){
            callback(err, val);
        });
    };

    users.update = function(userObj, callback){
        var currentUserId = userObj._id;

        internal.app.db.users.getByLogin(userObj.login, function(err, existingUserObj){
            //Validate if the user tried to change their role without being an admin.
            if(existingUserObj && (userObj.role != existingUserObj.role && existingUserObj.role != "admin")){
                callback(new Error("You do not have the permissions to change your role."), null);
            }
            else if(err || existingUserObj._id.toString() == currentUserId) {
                //If user changed their login and the new user login is not in the system it will return err
                internal.app.db.users.update(userObj, function(err, obj){

                    //Check to see if user state went from enabled to disabled. If disabled kill all auth tokens for uid
                    if(!err && userObj.enabled == false && existingUserObj.enabled == true){
                        internal.app.db.tokens.deleteByUserId(userObj._id, function(err){
                            callback(err, obj);
                        });
                    }
                    else {
                        callback(err, obj);
                    }
                });
            }
            else {
                callback(new Error("Different user with the same login already exists."));
            }
        });
    };

    users.disable = function(userId, callback){
        internal.app.db.users.getById(userId, function(err, val){
            if(err){
                callback(err, val);
            }
            else {
                if(val != null){
                    val.enabled = false;

                    internal.app.db.users.update(val, function(err){
                        callback(err);
                    });
                }
                else {
                    callback(new Error("Cannot disable user. User with provided ID could not be found."));
                }
            }
        });
    };

    users.enable = function(userId, callback){
        internal.app.db.users.getById(userId, function(err, val){
            if(err){
                callback(err, val);
            }
            else {
                if(val != null){
                    val.enabled = true;

                    internal.app.db.users.update(val, function(err){
                        callback(err);
                    });
                }
                else {
                    callback(new Error("Cannot enable user. User with provided ID could not be found."));
                }
            }
        });
    };

    users.deleteById = function(userId, callback){
        internal.app.db.users.deleteById(userId, function(err){
            if(err){
                callback(err);
            }
            else {
                callback(null);
            }
        });
    };

    users.list = function(options, callback){

        async.parallel(
            [
                function(cb){
                    internal.app.db.users.list(options, function(err, userList){
                        cb(err, userList);
                    });
                },
                function(cb){
                    internal.app.db.users.describe(options, function(err, totals){
                        cb(err, totals);
                    });
                }
            ],function(err, results){
                if(err){
                    callback(err);
                }
                else {
                    callback(null, {
                        total: results[1][0].count,
                        results: results[0]
                    });
                }
            }
        );

    };

    users.updatePermission = function(userId, permissions, callback){
        internal.app.db.users.savePermissions(userId, permissions.nodeid, permissions.role, function(err,results){
            callback(err, results);
        });
    };

    users.deletePermission = function(userId, nodeId, callback){
        internal.app.db.users.deletePermissions(userId, nodeId, function(err,results){
            callback(err, results);
        });
    };

    return users;
};

