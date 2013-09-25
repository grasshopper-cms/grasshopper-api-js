module.exports = function initContentTypes(app){
    "use strict";

    var contentTypes = {},
        internal = {},
        _ = require("underscore"),
        async = require("async"),
        AVAILABLE_FIELD_TYPES = [
            'readonly',
            'textbox',
            'textarea',
            'richtext',
            'dropdown',
            'checkbox',
            'content-reference',
            'file-reference',
            'datetime',
            'code-editor'
        ],
        LOGGING_CATEGORY = "GRASSHOPPER-CONTENT-TYPES";

    internal.app = app;

    function validateContentType(contentTypeObject, callback){

    }

    function isFieldValid(fieldObj){

    }

    function isValidFieldObject(collection){

    }

    contentTypes.create = function(obj, callback){
        validateContentType(obj, function(err){
            if(err){
                callback.call(this, err);
            }


        });
    };

    contentTypes.delete = function(){

    };

    contentTypes.update = function(){

    };

    contentTypes.getById = function(id, callback){
        internal.app.db.contentTypes.getById(id, function(err, val){
            callback(err, val);
        });
    };

    contentTypes.list = function(options, callback){

        async.parallel(
            [
                function(cb){
                    internal.app.db.contentTypes.list(options, function(err, list){
                        cb(err, list);
                    });
                },
                function(cb){
                    internal.app.db.contentTypes.describe(options, function(err, totals){
                        cb(err, totals);
                    });
                }
            ],function(err, results){
                if(err){
                    callback(err);
                }
                else {
                    callback(null, {
                        total: results[1][0].count,
                        results: results[0]
                    });
                }
            }
        );

    };

    return contentTypes;
};

