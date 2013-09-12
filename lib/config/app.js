/**
 * The app module is the glue for accessing the system. It creates all of the correct objects for database access
 * and logging.
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var app = function(config){
    "use strict";

    var app = {},
        cache = require('../utils/cache')(config.cache),
        log = require('solid-logger-js'),
        db = require('../db/database')(config.db),
        crypto = require('../utils/crypto')(config.crypto),
        util = require('util'),
        self = this;

    log.init(config.logger);

    app.cache = cache;
    app.log = log;
    app.db = db;
    app.crypto = crypto;

    // Objects that require caching and logging need to get a reference to the application. Please put them here.
    app.db.init(app, function(err){
        if(err){
            self.emit('failed', err);
        }
        else {
            self.emit('ready', app);
        }
    });
};

util.inherits(app, EventEmitter);
module.exports = app;