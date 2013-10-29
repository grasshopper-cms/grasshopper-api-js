/**
 * The mongodb module implements all of the operations needed to interface our cms with mongo.
 * @param config Database configuration values.
 * @returns {{}}
 */
(function(){
    "use strict";

    var db = {};

    db.tokens = require('./mongodb/tokens');
    db.users = require('./mongodb/users');
    db.contentTypes = require('./mongodb/contentTypes');
    db.nodes = require('./mongodb/nodes');

    module.exports = db;
})();
