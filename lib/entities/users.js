(function(){
    "use strict";

    var users = {},
        db = require("../db"),
        _ = require("underscore"),
        async = require("async"),
        privileges = require('./permissions/privileges'),
        LOGGING_CATEGORY = "GRASSHOPPER-USER";

    /**
     * Method to be called when you want to create a user in the system.
     * When saving a user all mandatory fields will be checked.
     * @param userObj
     * @param callback
     */
    users.create = function(userObj, callback){
        db.users.create(userObj, function(err, val){
            callback(err, val);
        });
    };

    users.getById = function(userId, callback){
        db.users.getById(userId, function(err, val){
            callback(err, val);
        });
    };

    users.getByEmail = function(userEmail, callback){
        db.users.getByEmail(userEmail, function(err, val){
            callback(err, val);
        });
    };

    users.getByLogin = function(userLogin, callback){
        db.users.getByLogin(userLogin, function(err, val){
            callback(err, val);
        });
    };

    users.authenticate = function(userLogin, userPassword, callback){
        db.users.authenticate(userLogin, userPassword, function(err, val){
            callback(err, val);
        });
    };

    users.update = function(userObj, callback){
        var currentUserId = userObj._id;

        db.users.getByLogin(userObj.login, function(err, existingUserObj){
            //Validate if the user tried to change their role without being an admin.
            if(existingUserObj && (userObj.role != existingUserObj.role && existingUserObj.role != privileges.available.ADMIN)){
                callback(new Error("You do not have the permissions to change your role."), null);
            }
            else if(err || existingUserObj._id.toString() == currentUserId) {
                //If user changed their login and the new user login is not in the system it will return err
                db.users.update(userObj, function(err, obj){

                    //Check to see if user state went from enabled to disabled. If disabled kill all auth tokens for uid
                    if(!err && userObj.enabled == false && existingUserObj.enabled == true){
                        db.tokens.deleteByUserId(existingUserObj._id.toString(), function(err){
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
        db.users.getById(userId, function(err, val){
            if(err){
                callback(err, val);
            }
            else {
                if(val != null){
                    val.enabled = false;

                    db.users.update(val, function(err){
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
        db.users.getById(userId, function(err, val){
            if(err){
                callback(err, val);
            }
            else {
                if(val != null){
                    val.enabled = true;

                    db.users.update(val, function(err){
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
        db.users.deleteById(userId, function(err){
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
                    db.users.list(options, function(err, userList){
                        cb(err, userList);
                    });
                },
                function(cb){
                    db.users.describe(options, function(err, totals){
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
        db.users.savePermissions(userId, permissions.nodeid, permissions.role, function(err,results){
            callback(err, results);
        });
    };

    users.deletePermission = function(userId, nodeId, callback){
        db.users.deletePermissions(userId, nodeId, function(err,results){
            callback(err, results);
        });
    };

    module.exports = users;
})();

