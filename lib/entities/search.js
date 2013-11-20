(function(){
    "use strict";

    var search = {},
        db = require("../db");

    search.query = function(nodes, types, filters, options, callback){
        db.search.query(nodes, types, filters, options, callback);
    };

    module.exports = search;
})();

