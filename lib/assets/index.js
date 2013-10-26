module.exports = function(config){
    "use strict";

    var assets = {},
        internal = {},
        _ = require("underscore"),
        async = require("async"),
        AWS = require('aws-sdk'),
        LOGGING_CATEGORY = "GRASSHOPPER-NODE";

    internal.config = config;

    if(config.storageengine == "aws") {
        AWS.config.update({
            accessKeyId: config.amazon.accessKeyId,
            secretAccessKey: config.amazon.secretAccessKey,
            region: config.amazon.region
        });

        var s3 = new AWS.S3();

        s3.listBuckets(function(err, data) {
            console.log(err);
            for (var index in data.Buckets) {
                var bucket = data.Buckets[index];
                console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
            }
        });
    }

    return assets;
};