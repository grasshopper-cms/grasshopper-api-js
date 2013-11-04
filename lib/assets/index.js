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

    assets.list = function(params, callback){
        internal.defaultEngine.list(params, callback);
    };

    assets.createDirectory = function(params, callback){
        function createDirectory(engine, next){
            internal.engines[engine].createDirectory(params, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), createDirectory, done);
    };

    assets.removeDirectory = function(params, callback){
        function removeDirectory(engine, next){
            internal.engines[engine].removeDirectory(params, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), removeDirectory, done);
    };

    assets.save = function(params, callback){

        function save(engine, next){
            internal.engines[engine].save(params, function(err){
                next(err);
            });
        }

        function done(err){
            fs.unlinkSync(params.path);
            callback(err);
        }

        async.each(_.keys(internal.engines), save, done);
    };

    assets.rename = function(params, callback){
        function rename(engine, next){
            internal.engines[engine].rename(params, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), rename, done);
    };

    assets.move = function(params, callback){
        function move(engine, next){
            internal.engines[engine].move(params, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), move, done);
    };

    assets.copy = function(params, callback){
        function copy(engine, next){
            internal.engines[engine].copy(params, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), copy, done);
    };

    assets.delete = function(params, callback){
        function del(engine, next){
            internal.engines[engine].delete(params, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), del, done);
    };

    assets.deleteAll = function(params, callback){
        function deleteAll(engine, next){
            internal.engines[engine].deleteAll(params, function(err){
                next(err);
            });
        }

        function done(err){
            callback(err);
        }

        async.each(_.keys(internal.engines), deleteAll, done);
    };

    module.exports = assets;
})();