(function(){
    "use strict";

    var assets = {},
        internal = {},
        async = require("async"),
        fs = require("fs"),
        config = require("../config").get("assets"),
        _ = require("underscore");

    internal.config = config;
    internal.engines = [];
    internal.defaultEngine = null;

    _.each(config.engines, function(engine){
        engine.tmpdir = config.tmpdir;
    });

    if(config.engines.amazon) {
        internal.engines.amazon = require('./aws').config(config.engines.amazon);
    }
    if(config.engines.local){
        internal.engines.local = require('./local').config(config.engines.local);
    }

    internal.defaultEngine = internal.engines[config.default];

    assets.list = function(nodeid, callback){
        internal.defaultEngine.list(nodeid, callback);
    };

    assets.save = function(nodeid, filename, path, callback){

        function save(engine, next){
            internal.engines[engine].save(nodeid, filename, path, function(err){
                next(err);
            });
        }

        function done(err){
            fs.unlinkSync(path);
            callback(err);
        }

        async.each(_.keys(internal.engines), save, done);
    };

    module.exports = assets;
})();