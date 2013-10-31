module.exports = (function(){
    "use strict";

    var engine = {},
        AWS = require('aws-sdk'),
        config = require("../../config"),
        log = require("solid-logger-js").init(config.logger),
        async = require('async'),
        fs = require('fs'),
        path = require('path'),
        internal = {},
        LOGGING_CATEGORY = "AWS-ASSET-MANAGER";

    internal.constructUrl = function(fileName){
        return path.join(internal.config.urlbase, internal.config.bucket, fileName);
    };

    internal.putObject = function(nodeid, filename, path, callback){
        var self = this;

        fs.stat(path, function(err, info) {
            var stream = fs.createReadStream(path);

            self.s3.putObject({
                Bucket: internal.config.bucket,
                ACL: "public-read",
                Key: nodeid + "/" + filename,
                ContentLength: info.size,
                Body: stream
            }, function (err, data) {
                callback(err, data);
            });
        });
    };

    internal.copyObject = function(params, callback){
        internal.s3.copyObject({
            Bucket: internal.config.bucket,
            ACL: "public-read",
            CopySource: path.join(internal.config.bucket, params.nodeid, params.original),
            Key: params.nodeid + "/" + params.updated
        }, function (err, data) {
            callback(err);
        });
    };

    internal.listObjects = function(nodeid, marker, callback){
        var allKeys = [];

        this.s3.listObjects({Bucket: internal.config.bucket, Prefix: nodeid}, function (err, data) {

            if(err) { callback(err); return; }

            allKeys.push(data.Contents);

            if(data.IsTruncated)
                internal.listObjects(nodeid, data.Contents.slice(-1)[0].Key, callback);
            else
                callback(err, allKeys);
        });
    };

    internal.validateBucket = function(bucket){
        this.s3.headBucket({Bucket: bucket}, function (err, data) {
            if(err) {
                log.error(LOGGING_CATEGORY, "!!!!!!!!!!! ERROR !!!!!!!!!!!!!");
                log.error(LOGGING_CATEGORY, "There is a problem accessing your Amazon S3 bucket.");
                log.error(LOGGING_CATEGORY, JSON.stringify(err));
            }
        });
    };

    engine.config = function(config){
        internal.config = config;

        AWS.config.update({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region
        });

        internal.s3 = new AWS.S3();
        internal.validateBucket(config.bucket);

        return this;
    };


    engine.rename = function(params, callback){
        function copy(next){
            internal.copyObject(params, next);
        }

        function del(next){
            internal.s3.deleteObject({
                Bucket: internal.config.bucket,
                Key: params.nodeid + "/" + params.original
            }, next);
        }

        function done(err){
            if(err) { log.error(LOGGING_CATEGORY, JSON.stringify(err)); }

            callback(err);
        }

        async.waterfall([copy, del],done);
    };

    engine.move = function(params, callback){
        var self = this;

        this.copy(params.nodeid, params.newnodeid, params.filename, function(err, data){
           if(err) {
               log.error(LOGGING_CATEGORY, JSON.stringify(err));
               callback(err);
               return;
           }

            self.delete(params.nodeid, params.filename, function(err, data){
                if(err) { log.error(LOGGING_CATEGORY, JSON.stringify(err)); }

               callback(err, data);
            });
        });
    };

    engine.copy = function(params, callback){
        internal.s3.copyObject({
            Bucket: internal.config.bucket,
            ACL: "public-read",
            CopySource: path.join(internal.config.bucket, params.nodeid, params.original),
            Key: params.newnodeid + "/" + params.filename
        }, function (err, data) {
            if(err) { log.error(LOGGING_CATEGORY, JSON.stringify(err)); }

            callback(err, data);
        });
    };

    engine.delete = function(params, callback){
        internal.s3.deleteObject({
            Bucket: internal.config.bucket,
            Key: params.nodeid + "/" + params.filename
        }, function (err, data) {
            if(err) { log.error(LOGGING_CATEGORY, JSON.stringify(err)); }

            callback(err, data);
        });
    };

    engine.deleteAll = function(params, callback){
        function getAllKeys(next){
            var keyCollection = [];

            function buildKeyObject(obj){
                keyCollection.push({
                    Key: ""
                });
            }

            internal.listObjects(params.nodeid, null, function(err, data){
                async.each(data, buildKeyObject, function(err){
                    console.log(keyCollection);
                    next(err, keyCollection);
                });

            });
        }

        function deleteKeys(keys, next){
            internal.s3.deleteObjects({
                Bucket: internal.config.bucket,
                Delete: keys
            }, function (err, data) {
                console.log(err, data);
                next(err);
            });
        }

        function done(err){
            if(err) { log.error(LOGGING_CATEGORY, JSON.stringify(err)); }

            callback(err);
        }

        async.waterfall([getAllKeys, deleteKeys], done);
    };

    engine.save = function(params, callback){
        internal.putObject(params.nodeid, params.filename, params.path, callback);
    };

    engine.list = function(params, callback){
        internal.listObjects(params.nodeid, null, function(err, data){
            var results = [];

            if(err) {
                log.error(LOGGING_CATEGORY, JSON.stringify(err));
                callback(err);
                return;
            }

            async.each(data[0],
                function(item, next){
                    if(item.Size > 0){
                        results[results.length] = {
                            url: internal.constructUrl(item.Key),
                            size: item.Size,
                            lastmodified: item.LastModified
                        };
                    }
                    next();
                },
                function(err){
                    callback(err, results);
                }
            );
        });
    };

    return engine;
})();