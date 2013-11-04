module.exports = (function(){
    "use strict";

    var engine = {},
        internal = {},
        fs = require("fs"),
        path = require("path"),
        async = require("async");

    engine.config = function(config){
        internal.config = config;

        return this;
    };

    engine.createDirectory = function(params, callback){
        fs.mkdir(path.join(internal.config.path, params.nodeid), "0755", function(err){
            callback(err);
        });
    };

    engine.removeDirectory = function(params, callback){
        fs.rmdir(path.join(internal.config.path, params.nodeid), function(err){
            callback(err);
        });
    };

    engine.list = function(params, callback){
        var p = path.join(internal.config.path, params.nodeid),
            results = [];

        fs.readdir(p, function (err, files) {
            if (err) {
                callback(err);
                return;
            }

            async.each(files, function(file, next){
                var stat = fs.statSync(path.join(p, file));

                if(stat.isFile()){
                    results[results.length] = {
                        url: path.join(internal.config.urlbase, params.nodeid, path.basename(file)),
                        size: stat.size,
                        lastmodified: stat.mtime
                    };
                }

                next();
            },function(){
                callback(null, results);
            });
        });
    };

    engine.rename = function(params, callback){
        var basePath = path.join(internal.config.path, params.nodeid),
            oldPath = path.join(basePath, params.original),
            newPath = path.join(basePath, params.updated);

        fs.rename(oldPath, newPath, function(err){
            callback(err);
        });
    };

    engine.move = function(params, callback){
        var oldPath = path.join(internal.config.path, params.nodeid, params.filename),
            newPath = path.join(internal.config.path, params.newnodeid, params.filename);

        fs.rename(oldPath, newPath, function(err){
           callback(err);
        });
    };

    engine.copy = function(params, callback){
        var oldPath = path.join(internal.config.path, params.nodeid, params.filename),
            newPath = path.join(internal.config.path, params.newnodeid, params.filename);

        fs.readFile(oldPath, function(err, data){
            if(err) { callback(err); return; }

            fs.writeFile(newPath, data, 'binary', function(err){
                callback(err);
            });
        });
    };

    engine.delete = function(params, callback){
        var filePath = path.join(internal.config.path, params.nodeid, params.filename);

        fs.unlink(filePath, function(err){
            callback(err);
        });
    };

    engine.deleteAll = function(params, callback){
        var dirPath = path.join(internal.config.path, params.nodeid);

        fs.readdir(dirPath, function(err, files){
            if(err){callback(err); return;}

            function rmFile(file, next){
                fs.unlink(path.join(dirPath, file), function(err){
                    next(err);
                });
            }

            function done(err){
                callback(err);
            }

            async.each(files,rmFile, done);
        });
    };

    engine.save = function(params, callback){
        var fullPath = path.resolve(internal.config.path, params.nodeid, params.filename);

        fs.readFile(params.path, function(err, data){
            if(err) { callback(err); return; }

            fs.writeFile(fullPath, data, 'binary', function(err){
                callback(err);
            });
        });

    };
    return engine;
})();