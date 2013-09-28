module.exports = function(app){
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

    function validateUser(userObj, mandatoryProps, cb){
        var props = Object.keys(userObj);

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

        validateUser(userObj, [
            'name',
            'password',
            'email',
            'role',
            'login'],
            function(err){
            if(err){
                callback(err);
            }
            else {
                if(userObj.enabled == null){
                    userObj.enabled = true;
                }

                internal.app.db.users.getByLogin(userObj.login, function(err, existingUserObj){
                    //This should always have an error since a user always should be unique
                    if(err) {
                        internal.app.db.users.create(userObj, function(err, val){
                            callback(err, val);
                        });
                    }
                    else {
                        callback(new Error("User with the same login already exists."));
                    }
                });

            }
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

    users.update = function(userObj, callback){
        validateUser(userObj,
                ['name',
                'email',
                'role',
                'login'],
                function(err){
            if(err){
                callback(err);
            }
            else {
                var currentUserId = userObj._id;

                internal.app.db.users.getByLogin(userObj.login, function(err, existingUserObj){
                    //If user changed their login and the new user login is not in the system it will return err
                    if(err || existingUserObj._id.toString() == currentUserId) {
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

    return users;
};

