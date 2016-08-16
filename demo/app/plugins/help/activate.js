'use strict';

var path = require('path'),
    grasshopperInstance = require('../../grasshopper/instance'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function activate() {
    console.log('Called activate on the Help plugin');

    return _insertTab()
        .then(function() {
            return  { 'state' : 'good to go' };
        });
};

function _insertTab() {
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
                    href : '/admin/help',
                    iconclasses : 'fa fa-question',
                    roles : 'admin reader editor',
                    addedby : 'Help Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
                    sort : 0
                }
            })
            .then(function() {
                return { 'state' : 'good to go' };
            })
            .catch(function(err) {
                console.log(err);
            });
}
