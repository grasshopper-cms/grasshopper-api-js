'use strict';

var getTabsContentTypeId = require('../settings').getTabsContentTypeId;

module.exports = function deactivate(grasshopperInstance) {
    console.log(`Called deactivate on the ${require('./config').title} plugin`);

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

    if(found) {
        return grasshopperInstance
                .request
                .content
                .deleteById(found._id)
                .then(function() {
                    console.log('Finished calling deactivate on this plugin.');
                    return { 'state' : 'unactivated' };
                });
    } else {
        return true;
    }
}
