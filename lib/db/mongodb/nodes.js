module.exports = (function(){
    "use strict";

    var _ = require("underscore"),
        mongoose = require('mongoose'),
        db = {};

    db.collectionName = 'nodes';
    db.schema = require('./schemas/node'),
    db.model = mongoose.model(db.collectionName, db.schema);

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

    db.getBySlug = function(slug, callback) {
        db.model.findOne({slug: slug}, this.buildIncludes()).lean().exec(function(err, doc){
            handleNode(err, doc, callback);
        });
    };

    return _.extend(require("./mixins/crud"), db);
})();
