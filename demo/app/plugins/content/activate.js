'use strict';

var path = require('path'),
    grasshopperInstance = require('../../grasshopper/instance'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function activate() {
    console.log('Called activate on the content plugin');

    return _insertContentTab()
        .then(function() {
            return  { 'state' : 'good to go' };
        });
};

function _insertContentTab() {
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
                    href : '/admin/items',
                    iconclasses : 'fa fa-th',
                    roles : 'admin reader editor',
                    addedby : 'Content Plugin : Version '+ require(path.join(__dirname, 'package.json')).version
                }
            })
            .then(function() {
                return { 'state' : 'good to go' };
            })
            .catch(function(err) {
                console.log(err);
            });
}