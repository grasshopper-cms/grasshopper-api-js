module.exports = (function() {
    "use strict";

    var app = require('./config/app'),
        api = {};

    api.auth = require('./entities/auth');
    api.nodes = require('./entities/nodes');

    api.init = function(config){
        app.init(config);
    };

    return api;
})();