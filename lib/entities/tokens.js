module.exports = (function(app){
    "use strict";

    var tokens = {};
    tokens.availableTokens = [];
    tokens.supers = [];


    tokens.resolveUserId = function(token){

    };

    tokens.isSuperUser = function(token){

    };

    tokens.addToken = function(token, userid){
        //[TODO] Need to crypt the user id info
        console.log('test');
    };

    tokens.addSuper = function(token, userid){

    };

    /**
     * Initialize the auth object with a configuration
     * @param config Object that includes information that this object needs like nodeid.
     */
    tokens.init = function(config){
        this.config = config;
    };

    return tokens;
})();