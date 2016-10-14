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
            href : 'items',
            partials : {
                'items': 'items/html/root'
            },
            iconclasses : 'fa fa-th',
            roles : 'admin reader editor',
            addedby : `Content Plugin : Version ${version}`,
            sort : 0,
            activeWhenRouteMatches : [ // Backbone style only
                '/items/nodeid/:nodeId/create-assets',
                '/items/nodeid/:nodeId/create-folder',
                '/items/nodeid/:nodeId/create-content',
                '/items(/nodeid/:nodeId/limit/:limit)',
                '/items(/nodeid/:nodeId/limit/:limit/skip/:skip)',
                '/items(/nodeid/:nodeId/limit/:limit/skip/:skip/query/:query)',
                '/items(/nodeid/:nodeId)',
                '/item/:id',
                '/items'
            ],
            scriptSource : '/admin/plguins/settings/bundle.js'
        }
    ]
};

