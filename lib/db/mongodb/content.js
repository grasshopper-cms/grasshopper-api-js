"use strict";

var mongoose = require('mongoose'),
    crud = require("./mixins/crud"),
    _ = require("underscore"),
    collectionName = "content",
    schema = require('./schemas/content'),
    fields = require('./mixins/fields'),
    filterFactory = require('./search/filterFactory'),
    content = Object.create(crud, {
        model: {value: mongoose.model(collectionName, schema)}
    });

function buildCollection(key, value, queryRef){
    var obj = {};

    if(value && value instanceof Array && value.length > 0){
        obj[key] = {$in: value};
    }
    else if(value && typeof value === "string" && value.length > 0){
        obj[key] = value;
    }

    _.extend(queryRef, obj);
}

function buildQuery(nodes, types, filters){
    var query = {};

    buildCollection("node._id", nodes, query);
    buildCollection("type", types, query);
    filterFactory.createQuery(filters, query);

    console.log(query);
    return query;
}

content.query = function(nodes, types, filters, options, callback){
    var q = buildQuery(nodes, types, filters);

    this.model.find(q, this.buildIncludes({
        include: options.include,
        exclude: options.exclude
    })).lean().exec(callback);

};

module.exports = content;