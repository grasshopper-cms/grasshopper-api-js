'use strict';

var path = require('path'),
    grasshopperInstance = require('../../grasshopper/instance'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function activate() {
    console.log('Called activate on the content types plugin');

    return _insertContentTypesTab()
        .then(function() {
            return  { 'state' : 'good to go' };
        });
};


function _insertContentTypesTab() {
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
                    href : '/admin/content-types',
                    iconclasses : 'fa fa-cogs',
                    roles : 'admin',
                    addedby : 'Content Types Plugin : Version '+ require(path.join(__dirname, 'package.json')).version
                }
            })
            .then(function() {
                return { 'state' : 'good to go' };
            })
            .catch(function(err) {
                console.log(err);
            });
}