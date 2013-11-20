"use strict";

var mongoose = require('mongoose'),
    util = require('util'),
    _ = require("underscore"),
    collectionName = "content",
    schema = require('./schemas/content'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    fields = require('./mixins/fields'),
    search = Object.create(fields,
        {model: {value: mongoose.model(collectionName, schema)}}
    );

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

    function buildFilters(filters, queryRef){

    }

    function buildQuery(nodes, types, filters){
        var query = {};

        buildCollection("node._id", nodes, query);
        buildCollection("type", types, query);
        buildFilters(filters, query);

        return query;
    }

    search.query = function(nodes, types, filters, options, callback){
        console.log(this);

        var q = buildQuery(nodes, types, filters);

        //console.log(util.inspect(q, { depth: null }));

        this.model.find(q, this.buildIncludes({
            include: options.include,
            exclued: options.exclude
        })).lean().exec(callback);

    };

module.exports = search;