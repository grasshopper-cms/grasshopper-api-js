/**
 * The database module acts as a factory to instantiate and prepare the database engine that has been selected
 * for this api instance. It is intended to be simple but in case it gets more complicated over time we removed the
 * functionality from the app module.
 */
module.exports = function initEngine(config){
    "use strict";

    var internal = {},
        engine = require('./' + config.type)(config);

    internal.config = config;


    return engine;
};

