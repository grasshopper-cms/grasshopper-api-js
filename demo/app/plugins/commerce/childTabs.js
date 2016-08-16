'use strict';

var path = require('path');

module.exports = [
    {
        title : 'Orders',
        active : true,
        href : '/admin/commerce/orders',
        iconclasses : 'fa fa-gift',
        roles : 'admin reader editor',
        addedby : 'Commerce Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
        sort : 0,
        ancestors : null
    },
    {
        title : 'Reports',
        active : true,
        href : '/admin/commerce/reports',
        iconclasses : 'fa fa-table',
        roles : 'admin reader editor',
        addedby : 'Commerce Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
        sort : 0,
        ancestors : null
    }
];