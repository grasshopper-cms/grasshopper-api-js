'use strict';

var path = require('path'),
    uuid = require('node-uuid'),
    version = require(path.join(__dirname, 'package.json')).version;

module.exports = {
    title : 'Commerce',
    version : version,
    description : 'Commerce Plugin',
    directory : 'commerce', // a semi unique id. Make sure is unique amongst plugins
    id : uuid.v1(), // Generated at runtime
    tabs : [
        {
            title : 'Commerce',
            active : true,
            href : '/admin/commerce',
            iconclasses : 'fa fa-gift',
            roles : 'admin reader editor',
            addedby : `Commerce Plugin : Version ${version}`,
            sort : 0,
            highlightedWhenRouteMatches : [ // Backbone style only
                '/commerce'
            ],
            subTabs: [
                {
                    title : 'Orders',
                    active : true,
                    href : '/admin/commerce/orders',
                    iconclasses : 'fa fa-gift',
                    roles : 'admin reader editor',
                    addedby : `Commerce Plugin : Version ${version}`,
                    sort : 0,
                    highlightedWhenRouteMatches : [ // Backbone style only
                        'commerce/orders'
                    ]
                },
                {
                    title : 'Reports',
                    active : true,
                    href : '/admin/commerce/reports',
                    iconclasses : 'fa fa-table',
                    roles : 'admin reader editor',
                    addedby : `Commerce Plugin : Version ${version}`,
                    sort : 0,
                    highlightedWhenRouteMatches : [ // Backbone style only
                        'commerce/reports'
                    ]
                }
            ]
        }
    ]
};