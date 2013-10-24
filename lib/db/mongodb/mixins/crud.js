/*
    The crud mixin for the mongo database layer is used for all of the functionality that is going to be shared between
    all connections.
 */
"use strict";

var _ = require("underscore"),
    Crud = {
        model: null,
        privateFields: [],
        /**
         * Build string variable that can be sent to mongo query to include or exclude fields in the response. Your
         * implementation module should set "privateFields" so that we can use the parameter here.
         *
         * @param options Query options object
         * @returns {string}
         */
        buildIncludes: function(options){
            var include = "";

            if(options && options.include != null && options.include instanceof Array){
                include = options.include.join(" ");
            }
            if(options && options.exclude != null && options.exclude instanceof Array){
                include += "-" + options.exclude.join(" -");
            }
            if(this.privateFields != null && this.privateFields instanceof Array){
                include += "-" + this.privateFields.join(" -");
            }

            return include;
        },
        /**
         * Filter/Format errors in a way that the system understands.
         *
         * @param err
         * @returns Error
         */
        handleError: function(err){
            var error = null;

            if(err.name == "ValidationError"){
                for (var key in err.errors) {
                    if (err.errors.hasOwnProperty(key)) {
                        error = new Error(err.errors[key].message);
                    }
                }
            }
            else if (err.name == "MongoError" && err.code == '11000') {
                error = new Error("Duplicate key already exists.");
            }
            else if(err.name == "CastError") {
                error = new Error(err.message);
            }
            else {
                error = err;
            }

            return error;
        },
        create: function(obj, callback){
            var self = this;

            this.model.create(obj, function(err, doc){
                if(err) {
                    callback(self.handleError(err));
                    return;
                }

                self.getById(doc._id, function(err, cleanObj){
                    callback(err, cleanObj);
                });
            });
        },
        update: function(obj, callback){
            var primaryKey = _.extend({}, obj)._id, self = this;
            delete obj._id;

            this.model.findById(primaryKey, function(err, doc) {
                if(err) {
                    callback(self.handleError(err));
                    return;
                }

                if(doc) {
                    _.each(_.keys(obj), function(key){
                        try{
                            doc[key] = obj[key];
                        }
                        catch(ex){
                            console.log(ex);
                        }
                        return;
                    });

                    doc.save(function(err){
                        if(err){
                            callback(self.handleError(err));
                        }
                        else {
                            self.getById(primaryKey, function(err, data){
                                callback(err, data);
                            });
                        }
                    });
                }
                else {
                    callback(new Error("Document does not exist."));
                }
            });
        },
        getById: function(id, callback) {
            var self = this;

            this.model.findById(id, this.buildIncludes()).lean().exec(function(err, doc){
                if(err) {
                    callback(err);
                    return;
                }
                else if (doc != null) {
                    callback(null, doc);
                }
                else {
                    callback(new Error("[404] getById:" + self.model.collectionName + ": '" + id + "' could not be found."));
                }
            });
        },
        list: function (options, callback){
            this.model.find(options.query,
                this.buildIncludes(options),
                {
                    limit: options.limit,
                    skip: options.skip
                }
            ).lean().exec(function (err, docs) {

                    if(err) {
                        callback(err);
                    }
                    else if (docs != null) {
                        callback(null, docs);
                    }
                });
        },
        describe: function (options, callback){
            this.model.aggregate([
                {$group : {
                    '_id' : "count",
                    'count' : {$sum : 1}
                }}
            ], function (err, items){
                callback(err, items);
            });
        },
        deleteById: function(id, callback){
            this.model.findByIdAndRemove(id, { }, function(err){
                if(err) {
                    callback(err);
                    return;
                }
                callback(null);
            });
        }
    };

module.exports = Crud;