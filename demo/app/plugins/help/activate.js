'use strict';

var path = require('path'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the Help plugin');

    grasshopperInstance.admin.get('/help', require('./index').get);

    return _queryForTab(grasshopperInstance)
        .then(_insertTab.bind(null, grasshopperInstance));
};

function _queryForTab(grasshopperInstance) {
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

function _insertTab(grasshopperInstance, queryResults) {
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
                        href : '/admin/help',
                        iconclasses : 'fa fa-question',
                        roles : 'admin reader editor',
                        addedby : 'Help Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
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
