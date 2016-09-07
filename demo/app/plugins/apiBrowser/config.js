'use strict';

var path = require('path'),
    uuid = require('node-uuid');

module.exports = {
    title : 'Api',
    version : require(path.join(__dirname, 'package.json')).version,
    description : 'Information About Current Apis',
    directory : 'apiBrowser', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1() // Generated at runtime
};