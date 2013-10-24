"use strict";

var mongoose = require('mongoose'),
    crud = require("./mixins/crud"),
    collectionName = "tokens",
    schema = require('./schemas/token');

var token = Object.create(crud,
    {model: {value: mongoose.model(collectionName, schema)}}
);

token.deleteByUserId = function(id, callback) {
    this.model.remove({ uid: id }, function(err){
        callback(err);
    });
};

module.exports = token;
