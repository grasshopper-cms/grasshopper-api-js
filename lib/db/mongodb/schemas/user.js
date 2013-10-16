module.exports = (function(){
    "use strict";

    var mongoose = require('mongoose'),
        validate = require('mongoose-validator').validate,
        crypto = require('../../../utils/crypto')({}),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        schema = new Schema({
            name : { type: String, trim: true },
            email : { type : String, required : true, lowercase: true, trim: true},
            role : { type : String, required : true, default: 'reader' },
            login :  { type : String, required : true, trim: true, index : { unique : true }, validate: validate('len', 4)},
            pass_hash : { type : String, required : true },
            salt      : { type : String, required : true },
            profile : [{}],
            permissions : [{
                nodeid : { type: ObjectId, required: true },
                role: {type : String, required : true}
            }],
            enabled : { type: Boolean, default: true },
            dateCreated : { type: Date, default: Date.now }
        });


    schema.virtual('password').set(function (password) {
        if(password && password.length >= 6){
            this.salt = crypto.createSalt();
            this.pass_hash = crypto.createHash(password, this.salt);
        }
    });

    schema.path('role').validate(function (value) {
        return /editor|author|reader|admin|none/i.test(value);
    }, 'Invalid color');

    schema.virtual('password').get(function () {
        return this.pass_hash;
    });

    schema.methods.authenticate = function (plaintext) {
        return crypto.createHash(plaintext, this.salt) === this.password;
    };

    schema.pre('save', function (next) {
        var err = null;

        if(!this.password || this.password.length < 6){
            err = new Error("Password is not long enough, it must be at least 6 characters.");
        }

        next(err);
    });

    return schema;
})();