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

    assets.rename = function(nodeid, original, updated, callback){
        function rename(engine, next){
            internal.engines[engine].rename(nodeid, original, updated, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), rename, done);
    };

    assets.move = function(nodeid, newnodeid, filename, callback){
        function move(engine, next){
            internal.engines[engine].rename(nodeid, newnodeid, filename, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), move, done);
    };

    assets.copy = function(nodeid, newnodeid, filename, callback){
        function copy(engine, next){
            internal.engines[engine].rename(nodeid, newnodeid, filename, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), copy, done);
    };

    assets.delete = function(nodeid, filename, callback){
        function del(engine, next){
            internal.engines[engine].rename(nodeid, filename, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), del, done);
    };

    assets.deleteAll = function(nodeid, callback){
        function deleteAll(engine, next){
            internal.engines[engine].rename(nodeid, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), deleteAll(), done);
    };

    module.exports = assets;
})();