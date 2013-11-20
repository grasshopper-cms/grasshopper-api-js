"use strict";

var mongoose = require('mongoose'),
    _ = require("underscore"),
    collectionName = "content",
    schema = require('./schemas/content'),
    fields = require('./mixins/fields'),
    search = Object.create(fields,
        {model: {value: mongoose.model(collectionName, schema)}}
    );



    search.query = function(nodes, types, filters, options, callback){
        console.log(this);
        //[TODO] Build includes needs to be modularized
        //this.model.find({}, this.buildIncludes()).lean().exec(function(err, doc){
        //    if(err) {
        //        callback(err);
        //        return;
        //    }

        //});
    };

module.exports = search;