/**
 * The app module is the glue for accessing the system. It creates all of the correct objects for database access
 * and logging.
 */
var app;

module.exports = app = function app(config){
    "use strict";

    var app = {},
        cache = require('../utils/cache')(config.cache),
        log = require('solid-logger-js'),
        db = require('../db/database')(config.db);

    log.init(config.logger);

    app.cache = cache;
    app.log = log;
    app.db = db;

    // Objects that require caching and logging need to get a reference to the application. Please put them here.
    app.db.init(app);

    return app;
};