/**
 * Tokens are used to send back a generic key that indicates that you have been logged in in the past. Having a valid
 * token means that once you log in, through the application you will not have to do it again unless the tokens have
 * been revoked or expired. This is handy when you have to do many operations at once. You would just log in, get a token
 * and send the token around to ensure that you have access to the system.
 * @type {tokens}
 */
module.exports = function tokens(app){
    "use strict";

    var self = {};
    self.tokens = [];
    self.supers = [];

    /**
     * Supers are SuperUsers, they can do anything, Only users that deserve this privilege and responsibility should
     * be granted it.
     * @param token String value returned from the "create" method.
     * @param userId String value for the User's ID
     */
    function addSuper(token, profile){
        if(self.supers[token] == null){
            self.supers[token] = app.crypto.encrypt(profile);
        }
    }

    /**
     * Everyone that is logged in needs to get added to the token collection.
     * @param token String value returned from the "create" method.
     * @param userId String value for the User's ID
     */
    function addToken(token, profile){
        if(self.tokens[token] == null){
            self.tokens[token] = app.crypto.encrypt(profile);
        }
    }

    /**
     * The validate method accepts a token value and returns back all of the details about the token from when it
     * was created.
     * @param token String value returned from the "create" method.
     * @returns {token, isValid, isSuper, userId}
     */
    self.validate = function(token){
        var obj = {};
        obj.token = token;
        obj.isValid = false;
        obj.isSuper = false;
        obj.profile = null;

        if(self.tokens[token] != null){
            obj.isValid = true;
            obj.profile = app.crypto.decrypt(self.tokens[token]);

            if(self.supers[token] != null) {
                obj.isSuper = true;
            }
        }

        return obj;
    }

    /**
     * If you want to log out or remove access from a specific token you can call revoke.
     * @param token String value returned from the "create" method.
     */
    self.revoke = function(token){
        self.tokens[token] = null;
    };

    /**
     * Method will create a token in the system for a specific user id. It assumes that you have been logged in and
     * your permissions have been validate.
     * @param userId String value for the User's ID
     * @param isSuper Boolean, are you a superUser?
     * @returns {token|isValid|isSuper|userId}
     */
    self.create = function(token, profile){
        var profileString = JSON.stringify(profile);

        if(profile.isSuper){
            addSuper(token, profileString);
        }

        addToken(token, profileString);

        return self.validate(token);
    };

    return self;
};
