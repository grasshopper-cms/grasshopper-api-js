'use strict';

var path = require('path'),
    express = require('express'),
    grasshopper = require('./grasshopper');

module.exports = function activate(grasshopperInstance) {
    console.log(`Called activate on the ${require('./config').title} plugin`);

    grasshopper.instance = grasshopperInstance;

    console.log('Adding GET admin/example route to api routes.');
    grasshopperInstance.admin.use('/plugins/apiBrowser/', express.static(path.join(__dirname, 'assets')));
    grasshopperInstance.admin.get('/api-browser', require('./index').get);

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
                    value : grasshopperInstance.state.tabsContentTypeId
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
                        type : grasshopperInstance.state.tabsContentTypeId,
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