'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    version = require(path.join(__dirname, 'package.json')).version;

module.exports = {
    title : 'Advanced Search',
    version : version,
    description : 'Advanced Search Plugin',
    directory : 'advancedSearch', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1(), // Generated at runtime
    tabs : [
        {
            title : 'Advanced Search',
            active : true,
            href : '/admin/advanced-search',
            iconclasses : 'fa fa-search',
            roles : 'admin reader editor',
            addedby : `Advanced Search Plugin : Version ${version}`,
            sort : 0
        }
    ]
};