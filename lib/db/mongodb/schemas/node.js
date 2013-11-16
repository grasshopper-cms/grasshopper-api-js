module.exports = (function(){
    "use strict";

    var mongoose = require('mongoose'),
        validate = require('mongoose-validator').validate,
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        schema = new Schema({
            label : { type: String, required : true, trim: true },
            slug : { type : String, required : true, unique: true, validate: validate('notContains', ' ') },
            allowedTypes : [{type: ObjectId, ref: 'contentTypes'}],
            meta: { type: Schema.Types.Mixed },
            ancestors : [{type: ObjectId, ref: 'nodes'}],
            parent: {type: ObjectId, ref: 'nodes'}
        });

    return schema;
})();