'use strict';

var path = require('path'),
    grasshopperInstance = require('../../grasshopper/instance'),
    express = require('express'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function activate() {
    console.log('Called activate on the content plugin');

    grasshopperInstance.admin.use('/plugins/content/', express.static(path.join(__dirname, 'assets')));
    grasshopperInstance.admin.get('/', require('./index').get);
    grasshopperInstance.admin.get('/items', require('./index').get);

    return _queryForContentTab()
        .then(_insertContentTab);
};

function _queryForContentTab() {
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

function _insertContentTab(queryResults) {
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
                        href : '/admin/items',
                        iconclasses : 'fa fa-th',
                        roles : 'admin reader editor',
                        addedby : 'Content Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
                        sort : 0
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
    } else {
        return queryResults.results[0];
    }
}