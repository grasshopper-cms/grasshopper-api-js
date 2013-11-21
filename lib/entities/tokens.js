/**
 * Tokens are used to send back a generic key that indicates that you have been logged in in the past. Having a valid
 * token means that once you log in, through the application you will not have to do it again unless the tokens have
 * been revoked or expired. This is handy when you have to do many operations at once. You would just log in, get a token
 * and send the token around to ensure that you have access to the system.
 * @type {tokens}
 */
(function(){
    "use strict";

    var self = {},
        crypto = require("../utils/crypto"),
        db = require("../db");

    /**
     * The validate method accepts a token value and returns back all of the details about the token from when it
     * was created.
     * @param token String value returned from the "create" method.
     * @returns {token, isValid, isSuper, userId}
     */
    self.getById = function(token, callback){
        db.tokens.getById(token,callback);
    };

    /**
     * If you want to log out or remove access from a specific token you can call revoke.
     * @param token String value returned from the "create" method.
     */
    self.deleteById = function(token, callback){
        db.tokens.deleteById(token, function(err, val){
            callback(err, val);
        });
    };

    /**
     * Method will create a token in the system for a specific user id. It assumes that you have been logged in and
     * your permissions have been validate.
     * @param userId String value for the User's ID
     * @param isSuper Boolean, are you a superUser?
     * @returns {token|isValid|isSuper|userId}
     */
    self.create = function(token, profile, callback){
        db.tokens.create({
            _id: token,
            uid: profile._id.toString(),
            created: new Date().toISOString()
        }, function(err, val){
            callback(err, val._id);
        });
    };

    module.exports = self;
})();