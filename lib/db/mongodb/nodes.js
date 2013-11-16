"use strict";
/*jslint node: true */

var mongoose = require('mongoose'),
    _ = require("underscore"),
    async = require("async"),
    crud = require("./mixins/crud"),
    collectionName = "nodes",
    schema = require('./schemas/node'),
    contentTypeSchema = require('./schemas/contentType'),
    contentTypeModel = mongoose.model('contentTypes', contentTypeSchema),
    node = Object.create(crud,
        {model: {value: mongoose.model(collectionName, schema)}}
    );


function handleNode(err, doc, callback){

    if(err) {
        callback(err);
    }
    else if (doc != null) {
        callback(null, doc);
    }
    else {
        callback(new Error("Node does not exist"));
    }
}

function getAncestors(id, callback){
    var ancestors = [];

    if(id != null && id != ""){
        node.getById(id, function(err, doc){
            if(doc && doc.ancestors){
                _.each(doc.ancestors, function(item){
                   ancestors.push(item._id);
                });
            }
            ancestors.push(id);

            callback(null, ancestors);
        });
    }
    else {
        callback(null, ancestors);
    }
}

node.create = function(obj, callback){
    var self = this;

    function create(ancestors, cb){
        obj.ancestors = ancestors;
        self.model.create(obj, function(err, doc){
            if(err) {
                callback(self.handleError(err));
                return;
            }

            self.getById(doc._id, function(err, cleanObj){
                cb(err, cleanObj);
            });
        });
    }


    function done(err, results){
        callback(err, results);
    }

    async.waterfall([
        async.apply(getAncestors, obj.parent),
        function(ancestors, cb){ create(ancestors, cb ); }
    ],done);
};

node.update = function(obj, callback){
    var self = this;

    function update(ancestors, cb){
        var primaryKey = _.extend({}, obj)._id;
        delete obj._id;
        obj.ancestors = ancestors;

        self.model.findById(primaryKey, function(err, doc) {
            if(err) {  cb(self.handleError(err)); return; }
            if(!doc) { cb(new Error("Document does not exist.")); return; }

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
                if(err){  cb(self.handleError(err)); return; }

                self.getById(primaryKey, function(err, data){
                        cb(err, data);
                });
            });
        });
    }

    function done(err, results){
        callback(err, results);
    }

    async.waterfall([
        async.apply(getAncestors, obj.parent),
        function(ancestors, cb){ update(ancestors, cb ); }
    ],done);
};

node.getById = function(id, callback) {
    this.model.findById(id, this.buildIncludes()).populate('allowedTypes parent ancestors', "_id label").lean().exec(function(err, doc){
        handleNode(err, doc, callback);
    });
};

node.getBySlug = function(slug, callback) {
    this.model.findOne({slug: slug}, this.buildIncludes()).populate('allowedTypes parent ancestors', "_id label").lean().exec(function(err, doc){
        handleNode(err, doc, callback);
    });
};

node.getByParent = function(id, callback){
    this.model.find({parent: id}, this.buildIncludes()).populate('allowedTypes parent ancestors', "_id label").lean().exec(function(err, doc){
        handleNode(err, doc, callback);
    });
};

node.addContentTypes = function(id, types, callback){
    this.model.findById(id, function(err, doc){
        if(err){
            callback(err);
            return;
        }

        _.each(types, function(item){
            doc.allowedTypes.addToSet(item.id);
        });

        doc.save(function (err) {
            callback(err);
        });
    });
};

module.exports = node;