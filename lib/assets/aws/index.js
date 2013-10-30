module.exports = (function(){
    "use strict";

    var engine = {},
        AWS = require('aws-sdk'),
        async = require('async'),
        fs = require('fs'),
        path = require('path'),
        internal = {};

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
                console.log("!!!!!!!!!!! ERROR !!!!!!!!!!!!!");
                console.log("There is a problem accessing your Amazon S3 bucket.");
                console.log(err);
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


    engine.copy = function(){

    };

    engine.save = function(nodeid, filename, path, callback){
        internal.putObject(nodeid, filename, path, callback);
    };

    engine.deleteByName = function(nodeid, filename, callback){

    };

    engine.deleteByNode = function(){

    };

    engine.list = function(nodeid, callback){
        internal.listObjects(nodeid, null, function(err, data){
            var results = [];

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