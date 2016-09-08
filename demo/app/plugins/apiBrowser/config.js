'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    version = require(path.join(__dirname, 'package.json')).version;

module.exports = {
    title : 'Api',
    version : version,
    description : 'Information About Current Apis',
    directory : 'apiBrowser', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1(), // Generated at runtime
    tabs : [
        {
            title : 'Api',
            active : true,
            href : '/admin/api-browser',
            iconclasses : 'fa fa-paper-plane',
            roles : 'admin reader editor',
            addedby : `Example Plugin : Version ${version}`,
            sort : 0
        }
    ]
};