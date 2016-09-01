'use strict';

var path = require('path'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId,
    parentContentId = null;

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the Commerce plugin');

    // add routes for commerce to grasshopper.
    // add types.

    return _queryForParentTab(grasshopperInstance)
        .then(_insertParentTab.bind(null, grasshopperInstance))
        .then(_queryForOrdersTab.bind(null, grasshopperInstance))
        .then(_insertOrdersTab.bind(null, grasshopperInstance))
        .then(_queryForReportsTab.bind(null, grasshopperInstance))
        .then(_insertReportsTab.bind(null, grasshopperInstance))
        .catch(function(err) {
            console.log(err);
        });
};

function _queryForParentTab(grasshopperInstance) {
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


function _insertParentTab(grasshopperInstance, queryResults) {
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

function _queryForOrdersTab(grasshopperInstance) {
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

function _insertOrdersTab(grasshopperInstance, queryResults) {
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

function _queryForReportsTab(grasshopperInstance) {
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

function _insertReportsTab(grasshopperInstance, queryResults) {
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