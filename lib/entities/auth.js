module.exports = (function(){
    "use strict";

    var auth = {},
        tokens = require('./tokens'),
        app = require('./config/app');

    /**
     * Initialize the auth object with a configuration
     * @param config Object that includes information that this object needs like nodeid.
     */
    auth.init = function(config){
        this.config = config;

        console.log('init');
    };


    return auth;
})();

