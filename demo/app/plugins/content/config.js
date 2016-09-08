'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    version = require(path.join(__dirname, 'package.json')).version;

module.exports = {
    title : 'Content',
    version : version,
    description : 'Content Plugin',
    directory : 'content', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1(), // Generated at runtime
    tabs : [
        {
            title : 'Content',
            active : true,
            href : '/admin/items',
            iconclasses : 'fa fa-th',
            roles : 'admin reader editor',
            addedby : `Content Plugin : Version ${version}`,
            sort : 0
        }
    ]
};