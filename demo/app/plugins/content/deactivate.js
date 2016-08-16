'use strict';

var grasshopperInstance = require('../../grasshopper/instance'),
    getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function deactivate() {
    console.log('called deactivate on the content plugin');

    return _queryForThisPluginsTab()
            .then(_deleteThisPluginsTab);
};

function _queryForThisPluginsTab() {
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

function _deleteThisPluginsTab(queryResults) {
    var found = queryResults.results.find(function(result) { return result.fields.title === require('./config').title; });

    return grasshopperInstance
            .request
            .content
            .deleteById(found._id)
            .then(function() {
                console.log('Finished calling deactivate on this plugin.');
                return { 'state' : 'unactivated' };
            });
}
