'use strict';

var settingsContentTypes = require('./settingsContentTypes'),
    path = require('path'),
    express = require('express'),
    thisPluginsConfig = require('./config'),
    grasshopper = require('./grasshopper');


module.exports = function activatePluginsPlugin(instance) {
    var state = { tabsContentType : '', pluginsContentType : '' };

    grasshopper.instance = instance;

    console.log('keys', Object.keys(instance));
    console.log('Adding the plugin plugins assets dir to the static path');
    instance.admin.use('/plugins/settings/', express.static(path.join(__dirname, 'assets')));
    instance.admin.get('/settings', require('./index').get);

    console.log('Adding PLUGIN route to api routes.');
    instance.router.post('/admin/settings/plugins/activate', require('./api/plugins/activate'));
    instance.router.post('/admin/settings/plugins/deactivate', require('./api/plugins/deactivate'));

    console.log('Adding TAB route to api routes.');
    instance.router.post('/admin/settings/tab/:id/activate', require('./api/tab/activate'));
    instance.router.post('/admin/settings/tab/:id/deactivate', require('./api/tab/deactivate'));
    instance.router.post('/admin/settings/tab/:id/update', require('./api/tab/update'));
    instance.router.post('/admin/settings/tab/create', require('./api/tab/create'));

    console.log('Adding TABS route to api routes.');
    instance.router.get('/admin/settings/tabs', require('./api/tabs/list'));
    instance.router.post('/admin/settings/tabs/update-sort', require('./api/tabs/updateSort'));

    return _ensurePluginsContentType()
        .then(function(pluginsContentType) {
            state.pluginsContentType = pluginsContentType;
        })
        .then(_ensureTabsContentType)
        .then(function(tabsContentType) {
            state.tabsContentType = tabsContentType;
            return _addThisPluginsMenuTab(tabsContentType);
        })
        .then(function() {
            return state;
        });
};

function _ensurePluginsContentType() {
    // Query GH for for a 'plugins' content type.
    // If it does not exist, insert it.
    return grasshopper.instance
        .request
        .contentTypes
        .list() // Cannot query content types yet.
        .then(function(queryResults) {
            console.log('>>>>>>>>>>>>> query results', queryResults);
            var found = queryResults
                    .results
                    .find(function(contentType) {
                        console.log(`comparing for plugins content type: ${contentType.label} to ${settingsContentTypes.plugins.label}`);
                        return contentType.label === settingsContentTypes.plugins.label;
                    });

            console.log('going into if else <<<<<<<<<<<<<');
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
    return grasshopper.instance
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

function _addThisPluginsMenuTab(tabsContentType) {
    console.log('Potentially Adding the Settings Tab Content');

    return grasshopper.instance
        .request
        .content
        .query({
            filters :[
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : tabsContentType
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

                return grasshopper.instance
                        .request
                        .content
                        .insert({
                            meta : {
                                type : tabsContentType,
                                hidden : true
                            },
                            fields : {
                                title : thisPluginsConfig.title,
                                active : true,
                                href : '/admin/settings',
                                iconclasses : 'fa fa fa-cogs',
                                roles : 'admin reader editor',
                                addedby : 'Settings Plugin Init Script, Version :'+ require(path.join(__dirname, 'package.json')).version,
                                sort : 1
                            }
                        });
            }
        });
}