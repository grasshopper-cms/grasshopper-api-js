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
    function validateUser(userObj, cd){
        var props = Object.keys(userObj),
            mandatoryProps = [
                'name',
                'password',
                'email',
                'role',
                'login'],
            isValid = true;

        async.each(mandatoryProps, function(prop, callback) {
                console.log(prop);
                if(!_.contains(props, prop)){
                    isValid = false;
                    callback(null,'fdsafsdafa');
                }

            //if(!_.contains(props, prop)){
            //    console.log('Property not found.');
            //    isValid = false;
           // }
        },function (err) {
            console.log('isValid: ' + isValid);
        //    callback();
        }
        );

    }
    users.create = function(userObj, callback){

        validateUser(userObj,function(){
            callback.call(this);
        });

        //internal.app.db.addUser(userObj, function(val){
        //    console.log(val);
        //});
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

