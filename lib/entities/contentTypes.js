(function(){
    "use strict";

    var contentTypes = {},
        db = require("../db"),
        config = require("../config"),
        log = require("solid-logger-js").init(config.logger),
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


    function validateContentType(obj, callback){
        var props = Object.keys(obj),
            mandatoryProps = [
                'label',
                'fields',
                'meta'
            ];

        async.each(mandatoryProps, function(prop, callback) {

            if(!_.contains(props, prop)){
                return callback(new Error("'" + prop + "' property not found when validating the content type."));
            }
            else if(prop == "fields" || prop == "meta"){
                return callback(isValidFieldObject(obj[prop]));
            }

            return callback(null);

        },function (err) {
            //All required fields have been checked. Now check optional params.
            if(err){
                log.error(LOGGING_CATEGORY, err.message);
                callback(err);
            }
            else {
                callback(null);
            }
        });

    }

    /**
     * A field is valid if:
     * 1) The passed in argument must be an instance of an object
     * 2) All of the mandatory properties are provided
     * 3) The id property cannot have any spaces
     * 4) The type property must be in the approved list
     * 5) The required property must be a boolean
     * @param obj
     * @returns {null}
     */
    function isValidField(obj){
        var err = null,
            props = Object.keys(obj),
            mandatoryProps = [
                'label',
                'type',
                'instancing',
                'required'
            ];

        if(!(obj instanceof Object)){
            err = new Error("Fields/Meta must be an instance of an object");
        }
        else {
            for(var x = 0; x < mandatoryProps.length; x++){
                var prop = mandatoryProps[x];

                if(!_.contains(props, prop)){
                    err = new Error("'" + prop + "' property not found when validating the content type.");
                }
            }

            if(!err && obj.id.indexOf(' ') >= 0){
                err = new Error("ids for fields/meta cannot have any spaces.");
            }

            if(!err && !_.contains(AVAILABLE_FIELD_TYPES, obj.type)){
                err = new Error("field type provided is not valid. ");
            }

            if(!err && (typeof obj.required != "boolean")){
                err = new Error("'required' field value should be a boolean.");
            }
        }

        if(err){
            log.error(LOGGING_CATEGORY, err.message);
        }

        return err;
    }

    /**
     * In order to be valid we are checking the following rules
     * 1) Collection must be an instance of an array
     * 2) Does the element in the Collection array have all of the necessary properties
     * 3) Are there any duplicate ids
     *
     * @param collection
     * @returns {null}
     */
    function isValidFieldObject(collection){
        var err = null,
            fieldPropertyTest = [];

        if(!(collection instanceof Array)){
            err = new Error("Fields/Meta must be an instance of an array");
        }
        else {
            for(var x = 0; x < collection.length; x++){
                err = isValidField(collection[x]);

                if(!err && _.contains(fieldPropertyTest, collection[x].id)){
                    err = new Error("'" + collection[x].id + "' appears to be a duplicate. All field/meta ids need to be unique.");
                }

                if(err){
                    break;
                }
                else {
                    fieldPropertyTest[fieldPropertyTest.length] = collection[x].id;
                }
            }
        }

        if(err){
            log.error(LOGGING_CATEGORY, err.message);
        }

        return err;
    }

    contentTypes.create = function(obj, callback){
        db.contentTypes.create(obj, function(err, val){
            callback(err, val);
        });
    };

    contentTypes.deleteById = function(id, callback){
        //[TODO] Make sure to delete content associated to this content type
        db.contentTypes.deleteById(id, function(err){
            callback(err);
        });
    };

    contentTypes.update = function(obj, callback){
        db.contentTypes.update(obj, function(err, val){
            callback(err, val);
        });
    };

    contentTypes.getById = function(id, callback){
        db.contentTypes.getById(id, function(err, val){
            callback(err, val);
        });
    };

    contentTypes.list = function(options, callback){

        async.parallel(
            [
                function(cb){
                    db.contentTypes.list(options, function(err, list){
                        cb(err, list);
                    });
                },
                function(cb){
                    db.contentTypes.describe(options, function(err, totals){
                        cb(err, totals);
                    });
                }
            ],function(err, results){
                if(err){
                    callback(err);
                }
                else {
                    var total = 0;

                    if(results[1][0]){
                        total = results[1][0].count;
                    }
                    callback(null, {
                        total: total,
                        results: results[0]
                    });
                }
            }
        );

    };

    module.exports = contentTypes;
})();

