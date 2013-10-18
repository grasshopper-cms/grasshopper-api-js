module.exports = (function(){
    "use strict";

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        schema = new Schema({
            label : { type: String, required : true, trim: true },
            slug : { type : String, required : true, unique: true },
            allowedTypes : [{type: ObjectId}],
            meta: { type: Schema.Types.Mixed },
            ancestors : [{type: ObjectId}],
            parent: {type: ObjectId}
        });

    return schema;
})();