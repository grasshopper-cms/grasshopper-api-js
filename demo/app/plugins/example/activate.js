'use strict';

var path = require('path'),
    grasshopperInstance = require('../../grasshopper/instance'),
    settings = require('../settings');

module.exports = function activate() {
    console.log('Called activate on the example plugin');

    return grasshopperInstance
            .request
            .content
            .insert({
                meta : {
                    type : settings.getTabsContentType(),
                    hidden : true
                },
                fields : {
                    title : require('./config').title,
                    active : true,
                    href : '/admin/example',
                    iconclasses : 'fa fa-bug fa-spin',
                    roles : 'admin reader editor',
                    addedby : 'Example Plugin : Version '+ require(path.join(__dirname, 'package.json')).version
                }
            })
            .then(function() {
                console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                return { 'state' : 'good to go' };
            })
            .catch(function(err) {
                console.log('############################');
                console.log(err);
            });
};