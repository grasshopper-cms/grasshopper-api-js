'use strict';

var path = require('path'),
    uuid = require('node-uuid');

module.exports = {
    title : 'Settings',
    version : require(path.join(__dirname, 'package.json')).version,
    description : 'Setting for Grasshopper Admin',
    directory : 'settings', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1() // Generated at runtime
};