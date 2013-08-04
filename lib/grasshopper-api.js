/**
 * Module that exposes the public API used to interface with the CMS
 * @param config
 * @returns {{auth: *, nodes: *}}
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var api = function(config){
    "use strict";

    var _app = require('./config/app'),
        app = new _app(config),
        api = {},
        self = this;

    api.auth = require('./entities/auth')(app);
    api.users = require('./entities/users')(app);
    api.nodes = require('./entities/nodes');

    app.on('ready', function(app){
        self.emit('ready', api);
    });
};

util.inherits(api, EventEmitter);
module.exports = api;