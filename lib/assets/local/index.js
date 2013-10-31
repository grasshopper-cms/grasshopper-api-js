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

        fs.rmdir(dirPath, function(err){
            callback(err);
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