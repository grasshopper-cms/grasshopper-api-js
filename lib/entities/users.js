module.exports = function initUsers(app){
    "use strict";

    var users = {},
        internal = {},
        _ = require("underscore"),
        async = require("async");

    internal.app = app;

    function validateUser(userObj, cb){
        var props = Object.keys(userObj),
            mandatoryProps = [
                'name',
                'password',
                'email',
                'role',
                'login'],
            totalProps = mandatoryProps.length,
            isValid = true,
            x = 0;

        async.each(mandatoryProps, function(prop, callback) {
                if(!_.contains(props, prop)){
                    var errMessage = "'" + prop + "' property not found when validating the user.";
                    isValid = false;

                    cb.call(this, new Error(errMessage));
                }
                x++;

                if(totalProps == x && isValid){
                    cb.call(this, null);
                }

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
        internal.app.db.updateUser(userObj, function(err){
            callback.call(this, err);
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

