"use strict";

var mongoose = require('mongoose'),
    _ = require("underscore"),
    collectionName = "content",
    schema = require('./schemas/content'),
    search = {
        model: {value: mongoose.model(collectionName, schema)}
    };



    search.query = function(nodes, types, filters, options, callback){
        //[TODO] Build includes needs to be modularized
        //this.model.find({}, this.buildIncludes()).lean().exec(function(err, doc){
        //    if(err) {
        //        callback(err);
        //        return;
        //    }

        //});
    };

module.exports = search;