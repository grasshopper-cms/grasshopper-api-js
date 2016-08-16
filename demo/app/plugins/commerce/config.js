'use strict';

var path = require('path'),
    uuid = require('node-uuid');

module.exports = {
    title : 'Commerce',
    version : require(path.join(__dirname, 'package.json')).version,
    description : 'Commerce Plugin',
    directory : 'commerce', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1() // Generated at runtime
};