'use strict';

var path = require('path'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the content types plugin');

    grasshopperInstance.admin.get('/content-types/*', require('./index').get);

    return _queryForContentTypeTab(grasshopperInstance)
        .then(_insertContentTypesTab.bind(null, grasshopperInstance));
};

function _queryForContentTypeTab(grasshopperInstance) {
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

function _insertContentTypesTab(grasshopperInstance, queryResults) {
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
                        href : '/admin/content-types',
                        iconclasses : 'fa fa-cogs',
                        roles : 'admin',
                        addedby : 'Content Types Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
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