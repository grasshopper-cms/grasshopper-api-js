(function(){
    "use strict";

    var content = {},
        db = require("../db");

    content.create = function(obj, callback){
        db.content.create(obj, callback);
    };

    content.getById = function(id, callback){
        db.content.getById(id, callback);
    };

    content.deleteById = function(id, callback){
        db.content.deleteById(id, callback);
    };

    content.update = function(obj, callback){
        db.content.update(obj, callback);
    };

    content.query = function(nodes, types, filters, options, callback){
        db.content.query(nodes, types, filters, options, callback);
    };

    module.exports = content;
})();

