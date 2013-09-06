module.exports = function initUsers(app){
    "use strict";

    var users = {},
        internal = {},
        _ = require("underscore"),
        async = require("async");

    internal.app = app;

    function requiredProperty(prop, callback){
        if(!_.contains(props, prop)){

        }
    }
    function validateUser(userObj, cb){
        var props = Object.keys(userObj),
            mandatoryProps = [
                'name',
                'password',
                'email',
                'role',
                'login'],
            isValid = true,
            totalProps = mandatoryProps.length,
            x = 0;


        async.each(mandatoryProps, function(prop, callback) {
                if(!_.contains(props, prop)){
                    console.log(prop + ': Property not found.');
                    isValid = false;
                }

                x++;

                if(totalProps == x){
                    cb.call(this, isValid);
                }

            },function (err) {
                console.log('isValid: ' + isValid);
                callback();
            }
        );

    }
    users.create = function(userObj, callback){

        validateUser(userObj,function(result){
            if(result){
                internal.app.db.addUser(userObj, function(val){
                    console.log(val);
                });
            }
            else {
                callback.call(this);
            }
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

