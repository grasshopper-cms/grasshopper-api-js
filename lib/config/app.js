/**
 * The app module is the glue for accessing the system. It creates all of the correct objects for database access
 * and logging.
 */
module.exports = (function(){
    "use strict";

    var app = {};
    app.db = require('../db/database');
    app.log = require('solid-logger-js');

    app.init = function(config){
        this.config = config;

        app.log.init(this.config.logger);
        app.db.init(this.config.db);
    };

    return app;
})();