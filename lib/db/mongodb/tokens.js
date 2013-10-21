module.exports = (function(){
    "use strict";

    var db = {},
        mongoose = require('mongoose'),
        _ = require("underscore");

    db.collectionName = 'tokens';
    db.schema = require('./schemas/token'),
    db.model = mongoose.model(db.collectionName, db.schema);

    db.deleteByUserId = function(id, callback) {
        db.model.remove({ uid: id }, function(err){
            callback(err);
        });
    };

    return _.extend(require("./mixins/crud"), db);
})();
