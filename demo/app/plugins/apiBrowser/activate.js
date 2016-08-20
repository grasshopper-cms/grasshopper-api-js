'use strict';

var path = require('path'),
    express = require('express'),
    grasshopperInstance = require('../../grasshopper/instance'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function activate() {
    console.log(`Called activate on the ${require('./config').title} plugin`);

    console.log('Adding GET admin/example route to api routes.');
    grasshopperInstance.admin.use('/plugins/apiBrowser/', express.static(path.join(__dirname, 'assets')));
    grasshopperInstance.admin.get('/api-browser', require('./index').get);

    return _queryForTab()
        .then(_insertTab);
};

function _queryForTab() {
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

function _insertTab(queryResults) {
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
                        href : '/admin/api-browser',
                        iconclasses : 'fa fa-paper-plane',
                        roles : 'admin reader editor',
                        addedby : 'Example Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
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

'use strict';