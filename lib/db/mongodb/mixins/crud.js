/*
    The crud mixin for the mongo database layer is used for all of the functionality that is going to be shared between
    all connections.
 */
module.exports = (function(){
    "use strict";

    var db = {};

    /**
     * Build string variable that can be sent to mongo query to include or exclude fields in the response. Your
     * implementation module should set "privateFields" so that we can use the parameter here.
     *
     * @param options Query options object
     * @returns {string}
     */
    db.buildIncludes = function(options){

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
    };

    /**
     * Filter/Format errors in a way that the system understands.
     *
     * @param err
     * @returns Error
     */
    db.handleError = function(err){
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
    };

    db.create = function(obj, callback){
        var self = this;
        this.model.create(obj, function(err, doc){
            if(err) {
                callback(self.handleError(err));
                return;
            }

            self.getById(doc._id, function(err, obj){
                callback(err, obj);
            });
        });
    };

    db.update = function(obj, callback){

        var primaryKey = obj._id, self = this;
        delete obj._id;

        this.model.findByIdAndUpdate(primaryKey, { $set: obj },  {safe:true}, function(err) {
            if(err) {
                callback(self.handleError(err));
                return;
            }

            self.getById(primaryKey, function(err, obj){
                callback(err, obj);
            });
        });
    };

    db.getById = function(id, callback) {
        var self = this;
        this.model.findById(id, this.buildIncludes(), function(err, doc){
            if(err) {
                callback(err);
                return;
            }
            else if (doc != null) {
                callback(null, doc);
            }
            else {
                callback(new Error("[404] getById:" + self.collectionName + ": '" + id + "' could not be found."));
            }
        });
    };

    db.list = function (options, callback){
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
    };

    db.describe = function (options, callback){
        this.model.aggregate([
            {$group : {
                '_id' : "count",
                'count' : {$sum : 1}
            }}
        ], function (err, items){
            callback(err, items);
        });
    };

    db.deleteById = function(id, callback){
      this.model.findByIdAndRemove(id, { }, function(err){
            if(err) {
                callback(err);
                return;
            }
            callback(null);
        });
    };

    return db;
})();
