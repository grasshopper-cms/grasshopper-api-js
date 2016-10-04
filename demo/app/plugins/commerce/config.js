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
            href : 'commerce',
            iconclasses : 'fa fa-gift',
            roles : 'admin reader editor',
            addedby : `Commerce Plugin : Version ${version}`,
            sort : 0,
            activeWhenRouteMatches : [ // Backbone style only
                'commerce'
            ],
            subTabs: [
                {
                    title : 'Options',
                    active : true,
                    href : 'commerce/options',
                    iconclasses : 'fa fa-cog',
                    roles : 'admin reader editor',
                    addedby : `Commerce Plugin : Version ${version}`,
                    sort : 1,
                    activeWhenRouteMatches : [ // Backbone style only
                        'commerce/options'
                    ]
                },
                {
                    title : 'Products',
                    active : true,
                    href : 'commerce/products',
                    iconclasses : 'fa fa-list',
                    roles : 'admin reader editor',
                    addedby : `Commerce Plugin : Version ${version}`,
                    sort : 0,
                    activeWhenRouteMatches : [ // Backbone style only
                        'commerce/products'
                    ]
                },
                {
                    title : 'Orders',
                    active : true,
                    href : 'commerce/orders',
                    iconclasses : 'fa fa-gift',
                    roles : 'admin reader editor',
                    addedby : `Commerce Plugin : Version ${version}`,
                    sort : 0,
                    activeWhenRouteMatches : [ // Backbone style only
                        'commerce/orders'
                    ]
                },
                {
                    title : 'Reports',
                    active : true,
                    href : 'commerce/reports',
                    iconclasses : 'fa fa-table',
                    roles : 'admin reader editor',
                    addedby : `Commerce Plugin : Version ${version}`,
                    sort : 0,
                    activeWhenRouteMatches : [ // Backbone style only
                        'commerce/reports'
                    ]
                }
            ]
        }
    ]
};