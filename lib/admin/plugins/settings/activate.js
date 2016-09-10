'use strict';

var settingsContentTypes = require('./settingsContentTypes'),
    path = require('path'),
    express = require('express'),
    thisPluginsConfig = require('./config'),
    grasshopper = require('./grasshopper');

module.exports = function activatePluginsPlugin() {
    var state = { tabsContentType : '', pluginsContentType : '' };

    console.log('Adding the plugin plugins assets dir to the static path');
    grasshopper.instance.admin.use('/plugins/settings/', express.static(path.join(__dirname, 'assets')));
    grasshopper.instance.admin.get('/settings', require('./index').get);

    console.log('Adding PLUGIN route to api routes.');
    grasshopper.instance.router.post('/admin/settings/plugins/activate', require('./api/plugins/activate'));
    grasshopper.instance.router.post('/admin/settings/plugins/deactivate', require('./api/plugins/deactivate'));

    console.log('Adding TAB route to api routes.');
    grasshopper.instance.router.post('/admin/settings/tab/:id/activate', require('./api/tab/activate'));
    grasshopper.instance.router.post('/admin/settings/tab/:id/deactivate', require('./api/tab/deactivate'));
    grasshopper.instance.router.post('/admin/settings/tab/:id/update', require('./api/tab/update'));
    grasshopper.instance.router.post('/admin/settings/tab/create', require('./api/tab/create'));

    console.log('Adding TABS route to api routes.');
    grasshopper.instance.router.get('/admin/settings/tabs', require('./api/tabs/list'));
    grasshopper.instance.router.post('/admin/settings/tabs/update-sort', require('./api/tabs/updateTabsSort'));

    return _ensurePluginsContentType()
        .then(function(pluginsContentTypeId) {
            grasshopper.instance.state.pluginsContentTypeId = pluginsContentTypeId;
        })
        .then(_ensureTabsContentType)
        .then(function(tabsContentTypeId) {
            grasshopper.instance.state.tabsContentTypeId = tabsContentTypeId;
            return _addThisPluginsMenuTab();
        })
        .then(function() {
            return state;
        });
};

function _ensurePluginsContentType() {
    // Query GH for for a 'plugins' content type.
    // If it does not exist, insert it.
    return grasshopper
        .instance
        .request
        .contentTypes
        .list() // Cannot query content types yet.
        .then(function(queryResults) {
            var found = queryResults
                    .results
                    .find(function(contentType) {
                        console.log(`comparing for plugins content type: ${contentType.label} to ${settingsContentTypes.plugins.label}`);
                        return contentType.label === settingsContentTypes.plugins.label;
                    });

            if(found) {
                console.log('Found Plugins Content Type');
                return found._id;
            } else {
                console.log('Could not find Plugins Content Type, inserting now');
                return grasshopper.instance
                    .request
                    .contentTypes
                    .insert(settingsContentTypes.plugins)
                    .then(function(newContentType) {
                        console.log('Finished inserting Plugins Content Type');
                        return newContentType._id;
                    });
            }
        });
}

function _ensureTabsContentType() {
    return grasshopper
        .instance
        .request
        .contentTypes
        .list() // Cannot query content types yet.
        .then(function(queryResults) {
            var found = queryResults
                    .results
                    .find(function(contentType) {
                        return contentType.label === settingsContentTypes.tabs.label;
                    });

            if(found) {
                console.log('Found Tabs Content Type');
                return found._id;
            } else {
                console.log('Could not find Tabs Content Type, inserting now');
                return grasshopper
                    .instance
                    .request
                    .contentTypes
                    .insert(settingsContentTypes.tabs)
                    .then(function(newContentType) {
                        console.log('Finished inserting Tabs Content type');
                        return newContentType._id;
                    });
            }
        });
}

function _addThisPluginsMenuTab() {
    console.log('Potentially Adding the Settings Tab Content');

    return grasshopper
        .instance
        .request
        .content
        .query({
            filters :[
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : grasshopper.instance.state.tabsContentTypeId
                }
            ]
        })
        .then(function(queryResults) {
            var found = queryResults && queryResults
                .results
                .find(function(result) {
                    return result.fields.title === thisPluginsConfig.title;
                });

            if(found) {
                console.log('Did not need to add the settings Tab Content');

                return true;
            } else {

                console.log('Could not find the settings tab Content. Adding now.');

                return grasshopper
                    .instance
                    .request
                    .content
                    .insert({
                        meta : {
                            type : grasshopper.instance.state.tabsContentTypeId,
                            hidden : true
                        },
                        fields : thisPluginsConfig.tabs[0]
                    });
            }
        });
}