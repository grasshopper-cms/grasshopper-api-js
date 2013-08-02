module.exports = (function crypto() {
    "use strict";

    var crypto = {},
        app = require('../config/app');
        //SHA256 = require("crypto-js/sha256");

    crypto.hashPassword = function(value){
        return value;
    };

    crypto.encrypt = function(value){
        return value;
    };

    crypto.decrypt = function(value){
        return value;
    };

    return crypto;
})();

