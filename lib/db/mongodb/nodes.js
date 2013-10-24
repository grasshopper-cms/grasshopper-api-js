var mongoose = require('mongoose'),
    _ = require("underscore"),
    crud = require("./mixins/crud"),
    collectionName = "nodes",
    schema = require('./schemas/node'),
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

node.getBySlug = function(slug, callback) {
    this.model.findOne({slug: slug}, this.buildIncludes()).lean().exec(function(err, doc){
        handleNode(err, doc, callback);
    });
};

module.exports = node;