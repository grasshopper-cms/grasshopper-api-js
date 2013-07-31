module.exports = function(app){
    "use strict";

    var tokens = {};
    tokens.availableTokens = [];
    tokens.supers = [];


    tokens.resolveUserId = function(token){

    };

    tokens.isSuperUser = function(token){

    };

    /**
     * Initialize the auth object with a configuration
     * @param config Object that includes information that this object needs like nodeid.
     */
    tokens.init = function(config){
        this.config = config;
    };

    return tokens;
};