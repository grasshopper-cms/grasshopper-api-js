module.exports = (function(){
    "use strict";

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        schema = new Schema({
            label : { type: String, required : true, trim: true },
            type : {type: ObjectId, ref: 'contentTypes'},
            nonce: { type: String },
            status : {type: String},
            node : {
                _id: {type: ObjectId, ref: 'nodes'},
                displayOrder: {type: Number}
            },
            fields: {},
            changelog: [{
                _id: {type: ObjectId},
                name: {type: String},
                action: {type: String},
                date: { type: Date, default: Date.now }
            }]
        },{collection: 'content'});

    return schema;
})();