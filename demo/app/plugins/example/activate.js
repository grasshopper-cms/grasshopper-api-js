'use strict';

var path = require('path'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the example plugin');

    console.log('Adding GET admin/example route to api routes.');
    grasshopperInstance.router.get('/admin/example', require('./index').get);

    return grasshopperInstance
            .request
            .content
            .insert({
                meta : {
                    type : getTabsContentTypeId(),
                    hidden : true
                },
                fields : {
                    title : require('./config').title,
                    active : true,
                    href : '/admin/example',
                    iconclasses : 'fa fa-bug fa-spin',
                    roles : 'admin reader editor',
                    addedby : 'Example Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
                    sort : 0
                }
            })
            .then(function() {
                return { 'state' : 'good to go' };
            })
            .catch(function(err) {
                console.log(err);
            });
};