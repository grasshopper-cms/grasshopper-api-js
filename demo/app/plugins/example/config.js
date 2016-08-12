'use strict';

var path = require('path'),
    uuid = require('node-uuid');

module.exports = {
    name : 'Example',
    version : require(path.join(__dirname, 'package.json')).version,
    description : 'This is what I do?',
    directory : 'example',
    id : uuid.v1() // Generated at runtime
};