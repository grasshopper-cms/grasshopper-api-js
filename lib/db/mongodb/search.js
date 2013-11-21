"use strict";

var mongoose = require('mongoose'),
    util = require('util'),
    _ = require("underscore"),
    collectionName = "content",
    schema = require('./schemas/content'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    fields = require('./mixins/fields'),
    comparisons = require('./search/comparisons'),
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
        var obj = {};

        _.each(filters, function(filter){
           obj[filter.key] = comparisons.parse(filter);
        });

        _.extend(queryRef, obj);
    }

    function buildQuery(nodes, types, filters){
        var query = {};

        buildCollection("node._id", nodes, query);
        buildCollection("type", types, query);
        buildFilters(filters, query);

        return query;
    }

    search.query = function(nodes, types, filters, options, callback){
        var q = buildQuery(nodes, types, filters);

        this.model.find(q, this.buildIncludes({
            include: options.include,
            exclude: options.exclude
        })).lean().exec(callback);

    };

module.exports = search;