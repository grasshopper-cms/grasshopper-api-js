'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    version = require(path.join(__dirname, 'package.json')).version;

module.exports = {
    title : 'Users',
    version : version,
    description : 'Users Plugin',
    directory : 'users', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1(), // Generated at runtime
    tabs : [
        {
            title : 'Users',
            active : true,
            href : 'users',
            iconclasses : 'fa fa-user',
            roles : 'admin',
            addedby : `Users Plugin : Version ${version}`,
            sort : 0,
            highlightedWhenRouteMatches : [ // Backbone style only
                'users(/limit/:limit/skip/:skip)',
                'users(/limit/:limit/skip/:skip/query/:query)',
                'user/:id',
                'add-user'
            ]
        }
    ]
};