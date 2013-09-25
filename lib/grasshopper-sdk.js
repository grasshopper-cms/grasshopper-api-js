/**
 * Module that exposes the public API used to interface with the CMS
 * @param config
 * @returns {{auth: *, nodes: *}}
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var sdkModule = function(config){
    "use strict";

    var sdkConfig   = require('./config/app'),
        internalSdk = new sdkConfig(config),
        sdkInstance = {},
        self        = this;

    //Set the api parameters after the app has been initialized.
    internalSdk.on('ready', function(app){
        sdkInstance.auth         = require('./entities/auth')(app);
        sdkInstance.users        = require('./entities/users')(app);
        sdkInstance.contentTypes = require('./entities/contentTypes')(app);
        sdkInstance.nodes        = require('./entities/nodes');
        sdkInstance.log          = app.log;
        sdkInstance.crypto       = app.crypto;
        sdkInstance.tokens       = app.tokens;

        self.emit('ready', sdkInstance);
    });
};

util.inherits(sdkModule, EventEmitter);
module.exports = sdkModule;