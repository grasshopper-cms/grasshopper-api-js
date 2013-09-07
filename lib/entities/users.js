module.exports = function initUsers(app){
    "use strict";

    var users = {},
        internal = {},
        _ = require("underscore"),
        async = require("async"),
        AVAILABLE_USER_ROLES = ['editor', 'author', 'reader', 'admin', 'none'],
        MINIMUM_USER_NAME_LENGTH = 4,
        MINIMUM_PASSWORD_LENGTH = 6,
        LOGGING_CATEGORY = "GRASSHOPPER-USER";

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
                else if(prop == "role" && !_.contains(AVAILABLE_USER_ROLES, userObj[prop])){
                    return callback(new Error("The role provided is not understood. Available roles are: " + AVAILABLE_USER_ROLES.join(",")));
                }

                return callback(null);

            },function (err) {
                //All required fields have been checked. Now check optional params.
                if(err){
                    internal.app.log.error(LOGGING_CATEGORY, err.message);
                }
                else {
                    if(userObj["permissions"] != null){
                        //If permissions exist it has to be an array.
                        if(userObj["permissions"] instanceof Array){
                            //Empty array is ok, just validate of params exist.
                            if(userObj["permissions"].length > 0){
                                for(var x = 0; x < userObj["permissions"].length; x++){
                                    //Each element must be an object
                                    if(userObj["permissions"][x] instanceof Object){
                                        var mandatoryProps = ["nodeid", "role"];

                                        for(var y = 0; y < mandatoryProps.length; y++){
                                            var props = Object.keys(userObj["permissions"][x]);

                                            if(!_.contains(props, mandatoryProps[y])){
                                                err = new Error(mandatoryProps[y] + " not supplied.");
                                                break;
                                            }
                                            else if(mandatoryProps[y] == "role" && !_.contains(AVAILABLE_USER_ROLES, userObj["permissions"][x][mandatoryProps[y]])){
                                                err = new Error("role provided is not valid. ");
                                                break;
                                            }
                                        }

                                    }
                                    else {
                                        err = new Error("permissions array elements must be objects.");
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            err = new Error("permissions object must be a valid array.");
                        }
                    }
                }

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
                if(userObj.enabled == null){
                    userObj.enabled = true;
                }
                
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

    users.getByEmail = function(userEmail, callback){

    };

    users.getByLogin = function(userLogin, callback){

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

    users.delete = function(userId, callback){

        internal.app.db.getUserById(userId, function(err, val){
            if(err){
                callback.call(this, err, val);
            }
            else {
                internal.app.db.deleteUserById(userId, function(err){
                    if(err){
                        console.log(err);
                        callback.call(this, err);
                    }
                    else {
                        callback.call(this, null);
                    }
                });
            }
        });
    };

    return users;
};

