"use strict";

var mongoose = require('mongoose'),
    crud = require("./mixins/crud"),
    _ = require("underscore"),
    collectionName = "content",
    schema = require('./schemas/content'),
    content = Object.create(crud, {
        model: {value: mongoose.model(collectionName, schema)}
    });

module.exports = content;