'use strict';

var path = require('path'),
    uuid = require('node-uuid');

module.exports = {
    title : 'Content Types',
    version : require(path.join(__dirname, 'package.json')).version,
    description : 'Content Types Plugin',
    directory : 'contentTypes', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1() // Generated at runtime
};