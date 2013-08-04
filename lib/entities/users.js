module.exports = function initUsers(app){
    "use strict";

    var users = {},
        internal = {};

    internal.app = app;

    users.create = function(userObj, callback){

        internal.app.db.addUser(userObj, function(val){
            console.log(val);
        });
    };

    users.getById = function(userId, callback){

    };

    users.getByUserName = function(userName, callback){

    };

    users.getByEmail = function(userEmail, callback){

    };

    users.update = function(userId, userObj, callback){

    };

    users.disable = function(userId, callback){

    };


    return users;
};

