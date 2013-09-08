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

    contentTypes.getList = function(){

    };

    contentTypes.getById = function(){

    };

    return contentTypes;
};

