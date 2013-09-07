module.exports = function initUsers(app){
    "use strict";

    var users = {},
        internal = {},
        _ = require("underscore"),
        async = require("async"),
        MINIMUM_USER_NAME_LENGTH = 4,
        MINIMUM_PASSWORD_LENGTH = 6;

    internal.app = app;

    function validateUser(userObj, cb){
        var props = Object.keys(userObj),
            mandatoryProps = [
                'name',
                'password',
                'email',
                'role',
                'login'];

        async.each(mandatoryProps, function(prop, callback) {
                if(!_.contains(props, prop)){
                    return callback(new Error("'" + prop + "' property not found when validating the user."));
                }
                else if(prop == "login" && (userObj[prop] == null || (userObj[prop] != null && userObj[prop].trim().length < MINIMUM_USER_NAME_LENGTH))){
                    return callback(new Error("The login property cannot be null and has to have a minimum length of " + MINIMUM_USER_NAME_LENGTH + " characters."));
                }
                else if(prop == "password" && (userObj[prop] == null || (userObj[prop] != null && userObj[prop].trim().length < MINIMUM_PASSWORD_LENGTH))){
                    return callback(new Error("The password property cannot be null and has to have a minimum length of " + MINIMUM_PASSWORD_LENGTH+ " characters."));
                }
                return callback(null);

            },function (err) {
                cb.call(this, err);
            }
        );

    }

    /**
     * Method to be called when you want to create a user in the system.
     * When saving a user all mandatory fields will be checked.
     * @param userObj
     * @param callback
     */
    users.create = function(userObj, callback){

        validateUser(userObj,function(err){
            if(err){
                callback.call(this, err);
            }
            else {
                internal.app.db.createUser(userObj, function(err, val){
                    callback.call(this, err, val);
                });
            }
        });


    };

    users.getById = function(userId, callback){
        internal.app.db.getUserById(userId, function(err, val){
            callback.call(this, err, val);
        });
    };

    users.getByUserName = function(userName, callback){

    };

    users.getByEmail = function(userEmail, callback){

    };

    users.update = function(userObj, callback){

        validateUser(userObj,function(err){
            if(err){
                callback.call(this, err);
            }
            else {
                internal.app.db.updateUser(userObj, function(err){
                    callback.call(this, err);
                });
            }
        });
    };

    users.disable = function(userId, callback){
        internal.app.db.getUserById(userId, function(err, val){
            if(err){
                callback.call(this, err, val);
            }
            else {
                if(val != null){
                    val.enabled = false;

                    internal.app.db.updateUser(val, function(err){
                        callback.call(this, err);
                    });
                }
                else {
                    callback.call(this, new Error("Cannot disable user. User with provided ID could not be found."));
                }
            }
        });
    };

    users.enable = function(userId, callback){
        internal.app.db.getUserById(userId, function(err, val){
            if(err){
                callback.call(this, err, val);
            }
            else {
                if(val != null){
                    val.enabled = true;

                    internal.app.db.updateUser(val, function(err){
                        callback.call(this, err);
                    });
                }
                else {
                    callback.call(this, new Error("Cannot enable user. User with provided ID could not be found."));
                }
            }
        });
    };

    return users;
};

