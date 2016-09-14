'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    version = require(path.join(__dirname, 'package.json')).version;

module.exports = {
    title : 'Help',
    version : version,
    description : 'Help Plugin',
    directory : 'help', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1(), // Generated at runtime
    tabs : [
        {
            title : 'Help',
            active : true,
            href : 'help',
            iconclasses : 'fa fa-question',
            roles : 'admin reader editor',
            addedby : `Help Plugin : Version ${version}`,
            sort : 0,
            highlightedWhenRouteMatches : [ // Backbone style only,
                'help'
            ]
        }
    ]
};