'use strict';

var path = require('path'),
    uuid = require('node-uuid');

module.exports = {
    title : 'Example',
    version : require(path.join(__dirname, 'package.json')).version,
    description : 'This is what I do?',
    directory : 'example', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1() // Generated at runtime
};