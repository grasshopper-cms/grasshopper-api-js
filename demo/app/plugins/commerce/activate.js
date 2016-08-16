'use strict';

var path = require('path'),
    BB = require('bluebird'),
    childTabs = require('./childTabs'),
    grasshopperInstance = require('../../grasshopper/instance'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function activate() {
    console.log('Called activate on the Commerce plugin');

    return _insertParentTab()
        .then(_insertChildTabs)
        .then(function() {
            return  { 'state' : 'good to go' };
        })
        .catch(function(err) {
            console.log(err);
        });
};

function _insertParentTab() {
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
                    href : '/admin/commerce',
                    iconclasses : 'fa fa-gift',
                    roles : 'admin reader editor',
                    addedby : 'Commerce Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
                    sort : 0
                }
            })
            .then(function(insertedContent) {
                return insertedContent._id;
            });
}

function _insertChildTabs(parentContentId) {
    return BB.all(childTabs.map(function(childTab) {
        childTab.ancestors = [parentContentId];
        return grasshopperInstance
                .request
                .content
                .insert({
                    meta : {
                        type : getTabsContentTypeId(),
                        hidden : true
                    },
                    fields : childTab
                });
    }));
}
