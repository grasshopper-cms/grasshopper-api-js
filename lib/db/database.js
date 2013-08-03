/**
 * The database module acts as a factory to instantiate and prepare the database engine that has been selected
 * for this api instance. It is intended to be simple but in case it gets more complicated over time we removed the
 * functionality from the app module.
 */
module.exports = (function(){
    "use strict";

    var db = {};
    db.engine = null;

    db.init = function(config){
        this.config = config;

        db.engine = require('./' + this.config.type);
        db.engine.init(this.config);
    };

    return db;
})();

