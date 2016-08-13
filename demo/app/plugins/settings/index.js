'use strict';

var fs = require('fs'),
    path = require('path'),
    defaultsDeep = require('lodash/defaultsDeep'),
    BB = require('bluebird'),
    grasshopperInstance = require('../../grasshopper/instance'),
    Response = grasshopperInstance.bridgetown.Response,
    activate = require('./activate'),
    pluginsContentTypeId = null,
    tabsContentTypeId = null,
    possiblePlugins = fs
        .readdirSync(path.join(__dirname, '..', '..', 'plugins'))
        .filter(function(dirname) {
            return dirname !== 'settings'; // Remove THIS plugin from the possible plugins
        })
        .map(function(dirname) {
            return require(path.join(__dirname, '..', '..', 'plugins', dirname, 'config.js'));
        });

module.exports = {
    get : get,

    onAppInit : onAppInit,
    getTabsContentType : getTabsContentType
};

function onAppInit() {
    console.log('Activating the admin plugins plugin');
    return activate(_handleUpdatePlugins, _handleUpdateTabs)
        .then(function(state) {

            pluginsContentTypeId = state.pluginsContentType;
            tabsContentTypeId = state.tabsContentType;
        });
}

function getTabsContentType() {
    return tabsContentTypeId;
}

function get(request, response) {
    BB.bind({
        plugins : [],
        tabs : []
    })
        .then(_getActivePlugins)
        .then(_getTabs)
        .then(function() {
            response.render(require.resolve('./template.pug'),
                defaultsDeep({
                    plugins : possiblePlugins
                        .map(function(possiblePlugin) {
                            possiblePlugin.active = !!this.plugins
                                .find(function(activePlugin) {
                                    return activePlugin.fields.directory === possiblePlugin.directory;
                                });

                            return possiblePlugin;
                        }.bind(this)),
                    tabs : this.tabs
                }, response.locals));
        });
}

function _getActivePlugins() {
    return grasshopperInstance
        .request
        .content
        .query({
            filters :[
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : pluginsContentTypeId
                },
                {
                    key : 'fields.active',
                    cmp : '=',
                    value : true
                }
            ]
        })
        .then(function(queryResults) {
            this.plugins = queryResults.results;
        }.bind(this));
}

function _getTabs() {
    return grasshopperInstance
        .request
        .content
        .query({
            filters :[
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : tabsContentTypeId
                }
            ]
        })
        .then(function(queryResults) {
            this.tabs = queryResults.results;
        }.bind(this));
}

function _handleUpdatePlugins(request, response) {
    var pluginIdToActivate = request.body.id;

    if(!pluginIdToActivate) {
        new Response(response).writeError({ message : 'You must send a plugin ID.', code : 400 });
    } else if(!_pluginExists(pluginIdToActivate)){
        new Response(response).writeError({ message : 'The plugin you wanted to activate does not exist.', code : 400 });
    } else {
        _activateOrDeactivatePlugin(response, pluginIdToActivate)
            .then(_activePluginInDB(response, pluginIdToActivate))
            .then(function(activationBody) {
                new Response(response).writeSuccess(activationBody);
            })
            .catch(function(err) {
                new Response(response).writeError('Plugin could not be activated '+ err);
            });
    }
}

function _handleUpdateTabs(request, response) {
    new Response(response).writeSuccess('');
    // var pluginIdToActivateå = request.body.id;
    //
    // if(!pluginIdToActivate) {
    //     new Response(response).writeError({ message : 'You must send a plugin ID.', code : 400 });
    // } else if(!_pluginExists(pluginIdToActivate)){
    //     new Response(response).writeError({ message : 'The plugin you wanted to activate does not exist.', code : 400 });
    // } else {
    //     _activateOrDeactivatePlugin(response, pluginIdToActivate)
    //         .then(_activePluginInDB(response, pluginIdToActivate))
    //         .then(function(activationBody) {
    //             new Response(response).writeSuccess(activationBody);
    //         })
    //         .catch(function(err) {
    //             new Response(response).writeError('Plugin could not be activated '+ err);
    //         });
    // }
}

function _pluginExists(pluginIdToActive) {
    return !!possiblePlugins.find(function(plugin) {
        return plugin.id === pluginIdToActive;
    });
}

function _activateOrDeactivatePlugin(response, pluginIdToActivate) {
    var thisPlugin = possiblePlugins
            .find(function(plugin) {
                return plugin.id === pluginIdToActivate;
            });

    return grasshopperInstance
            .request
            .content
            .query({
                filters :[
                    {
                        key : 'meta.type',
                        cmp : '=',
                        value : pluginsContentTypeId
                    },
                    {
                        key : 'fields.active',
                        cmp : '=',
                        value : true
                    }
                ]
            })
            .then(function(queryResults) {
                if(queryResults.results.find(function(result) { return result.fields.directory === thisPlugin.directory; })) {
                    console.log('Deactivating Plugin : '+ thisPlugin.title);
                    return require(path.join(__dirname, '..', thisPlugin.directory, 'deactivate'))();
                } else {
                    console.log('Activating Plugin : '+ thisPlugin.title);
                    return require(path.join(__dirname, '..', thisPlugin.directory, 'activate'))();
                }
            });
}

function _activePluginInDB(response, pluginIdToActivate) {
    return function(activationBody) {
        var thisPlugin = possiblePlugins
                .find(function(plugin) {
                    return plugin.id === pluginIdToActivate;
                });

        return grasshopperInstance
                .request
                .content
                .query({
                    filters :[
                        {
                            key : 'meta.type',
                            cmp : '=',
                            value : pluginsContentTypeId
                        },
                        {
                            key : 'fields.directory',
                            cmp : '=',
                            value : thisPlugin.directory
                        }
                    ]
                })
                .then(function(queryResults) {
                    var found = queryResults
                            .results
                            .find(function(result) {
                                return thisPlugin.directory === result.fields.directory;
                            });

                    if(found) {
                        return grasshopperInstance
                                .request
                                .content
                                .update(defaultsDeep({
                                    fields : {
                                        active : !found.fields.active
                                    }
                                }, found))
                                .then(function() {
                                    return activationBody;
                                });
                    } else {
                        return grasshopperInstance
                                .request
                                .content
                                .insert({
                                    meta : {
                                        type : pluginsContentTypeId,
                                        hidden : true
                                    },
                                    fields : {
                                        title : thisPlugin.title,
                                        version : thisPlugin.version,
                                        description : thisPlugin.description,
                                        directory : thisPlugin.directory,
                                        active : true
                                    }
                                })
                                .then(function() {
                                    return activationBody;
                                });
                    }
                });
    };
}
