'use strict';

var path = require('path'),
    grasshopperInstance = require('../../grasshopper/instance'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId,
    parentContentId = null;

module.exports = function activate() {
    console.log('Called activate on the Commerce plugin');

    // add routes for commerce to grasshopper.
    // add types.

    return _queryForParentTab()
        .then(_insertParentTab)
        .then(_queryForOrdersTab)
        .then(_insertOrdersTab)
        .then(_queryForReportsTab)
        .then(_insertReportsTab)
        .catch(function(err) {
            console.log(err);
        });
};

function _queryForParentTab() {
    return grasshopperInstance
        .request
        .content
        .query({
            filters : [
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : getTabsContentTypeId()
                },
                {
                    key : 'fields.title',
                    cmp : '=',
                    value : require('./config').title
                }
            ]
        });
}


function _insertParentTab(queryResults) {
    if(!queryResults.results.length) {
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
                    parentContentId = insertedContent._id;
                });
    } else {
        parentContentId = queryResults.results[0]._id;
    }
}

function _queryForOrdersTab() {
    return grasshopperInstance
        .request
        .content
        .query({
            filters : [
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : getTabsContentTypeId()
                },
                {
                    key : 'fields.title',
                    cmp : '=',
                    value : 'Orders'
                }
            ]
        });
}

function _insertOrdersTab(queryResults) {
    if(!queryResults.results.length) {
        return grasshopperInstance
                .request
                .content
                .insert({
                    meta : {
                        type : getTabsContentTypeId(),
                        hidden : true
                    },
                    fields : {
                        title : 'Orders',
                        active : true,
                        href : '/admin/commerce/orders',
                        iconclasses : 'fa fa-gift',
                        roles : 'admin reader editor',
                        addedby : 'Commerce Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
                        sort : 0,
                        ancestors : [parentContentId]
                    }
                });
    }
}

function _queryForReportsTab() {
    return grasshopperInstance
        .request
        .content
        .query({
            filters : [
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : getTabsContentTypeId()
                },
                {
                    key : 'fields.title',
                    cmp : '=',
                    value : 'Reports'
                }
            ]
        });
}

function _insertReportsTab(queryResults) {
    if(!queryResults.results.length) {
        return grasshopperInstance
                .request
                .content
                .insert({
                    meta : {
                        type : getTabsContentTypeId(),
                        hidden : true
                    },
                    fields : {
                        title : 'Reports',
                        active : true,
                        href : '/admin/commerce/reports',
                        iconclasses : 'fa fa-table',
                        roles : 'admin reader editor',
                        addedby : 'Commerce Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
                        sort : 0,
                        ancestors : [parentContentId]
                    }
                });
    }
}