'use strict';

var grasshopperInstance = require('../../grasshopper/instance'),
    settings = require('../settings');

module.exports = function deactivate() {
    console.log('called deactivate on the example plugin');

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
                        value : settings.getTabsContentType()
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
                return { 'state' : 'unactivated' };
            });
}
