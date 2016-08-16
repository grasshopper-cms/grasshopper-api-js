'use strict';

var path = require('path'),
    uuid = require('node-uuid');

module.exports = {
    title : 'Advanced Search',
    version : require(path.join(__dirname, 'package.json')).version,
    description : 'Advanced Search Plugin',
    directory : 'advancedSearch', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1() // Generated at runtime
};