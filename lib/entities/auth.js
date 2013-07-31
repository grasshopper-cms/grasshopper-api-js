module.exports = function(app){
    "use strict";

    var auth = {},
        tokens = require('tokens');

    /**
     * Initialize the auth object with a configuration
     * @param config Object that includes information that this object needs like nodeid.
     */
    auth.init = function(config){
        this.config = config;
    };


    return auth;
};