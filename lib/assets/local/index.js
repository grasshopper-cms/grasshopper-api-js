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


    engine.list = function(nodeid, callback){
        var p = path.join(internal.config.path, nodeid),
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
                        url: path.join(internal.config.urlbase, nodeid, path.basename(file)),
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

    engine.rename = function(nodeid, original, updated, callback){
        callback(null);
    };

    engine.move = function(nodeid, newnodeid, filename, callback){
        callback(null);
    };

    engine.copy = function(nodeid, newnodeid, filename, callback){
        callback(null);
    };

    engine.delete = function(nodeid, filename, callback){
        callback(null);
    };

    engine.deleteAll = function(nodeid, callback){
        callback(null);
    };

    engine.save = function(nodeid, filename, filepath, callback){
        var fullPath = path.resolve(internal.config.path, nodeid, filename);

        fs.readFile(filepath, function(err, data){
            fs.writeFile(fullPath, data, 'binary', function(err){
                callback(err);
            });
        });

    };
    return engine;
})();