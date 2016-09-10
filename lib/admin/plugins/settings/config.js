'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    version = require(path.join(__dirname, 'package.json')).version;

module.exports = {
    title : 'Settings',
    version : version,
    description : 'Setting for Grasshopper Admin',
    directory : 'settings', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1(), // Generated at runtime
    tabs : [
        {
            title : 'Settings',
            active : true,
            href : '/admin/settings',
            iconclasses : 'fa fa fa-cogs',
            roles : 'admin reader editor',
            addedby : `Settings Plugin Init Script, Version :${ version }`,
            sort : 1,
            highlightedWhenRouteMatches : [ // Backbone Style Only
                'settings'
            ]
        }
    ]
};

