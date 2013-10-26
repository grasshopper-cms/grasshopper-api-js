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