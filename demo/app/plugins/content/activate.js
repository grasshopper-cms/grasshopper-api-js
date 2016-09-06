'use strict';

console.log('------------------- content activate required --------------------------');
var path = require('path'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the content plugin');

    grasshopperInstance.admin.get('/items/*', require('./index').get);
    grasshopperInstance.admin.get('/', require('./index').get);

    return _queryForContentTab(grasshopperInstance)
        .then(_insertContentTab.bind(null, grasshopperInstance));
};

function _queryForContentTab(grasshopperInstance) {
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

function _insertContentTab(grasshopperInstance, queryResults) {
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