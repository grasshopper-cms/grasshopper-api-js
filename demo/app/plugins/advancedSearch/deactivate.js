'use strict';

var getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function deactivate(grasshopperInstance) {
    console.log('called deactivate on the Advanced Search plugin');

    return _queryForThisPluginsTab(grasshopperInstance)
            .then(_deleteThisPluginsTab.bind(null, grasshopperInstance));
};

function _queryForThisPluginsTab(grasshopperInstance) {
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

function _deleteThisPluginsTab(grasshopperInstance, queryResults) {
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
