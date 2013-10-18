module.exports = (function (){
    "use strict";

    var db = {},
        mongoose = require('mongoose'),
        _ = require("underscore");

    db.collectionName = 'contentTypes';
    db.schema = require('./schemas/contentType'),
    db.model = mongoose.model(db.collectionName, db.schema);


    return _.extend(db, require("./mixins/crud"));
})();
