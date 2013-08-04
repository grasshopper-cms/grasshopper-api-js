/**
 * The app module is the glue for accessing the system. It creates all of the correct objects for database access
 * and logging.
 */
module.exports = (function(){
    "use strict";

    var internal = {},
        app = {};

    app.db = require('../db/database');
    app.cache = require('../utils/cache');
    app.log = require('solid-logger-js');

    app.init = function(config){
        internal.config = config;

        app.log.init(internal.config.logger);
        app.db.init(internal.config.db);
        app.cache.init(internal.config.cache);
    };

    return app;
})();