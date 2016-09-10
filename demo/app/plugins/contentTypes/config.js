'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    version = require(path.join(__dirname, 'package.json')).version;

module.exports = {
    title : 'Content Types',
    version : version,
    description : 'Content Types Plugin',
    directory : 'contentTypes', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1(), // Generated at runtime
    tabs : [
        {
            title : 'Content Types',
            active : true,
            href : 'content-types',
            iconclasses : 'fa fa-cogs',
            roles : 'admin',
            addedby : `Content Types Plugin : Version ${version}`,
            sort : 0,
            highlightedWhenRouteMatches : [ // Backbone style only
                'content-types',
                'content-types/new',
                'content-types(/:id)'
            ]
        }
    ]
};