'use strict';

var grasshopperInstance = require('../../grasshopper').instance,
    Response = grasshopperInstance.bridgetown.Response,
    path = require('path'),
    fs = require('fs'),
    defaultsDeep = require('lodash/defaultsDeep'),
    getPossiblePlugins = require('../../index').getPossiblePlugins,
    getProjectRootPath = require('../../index').getProjectRootPath,
    getPluginsContentTypeId = require('../../index').getPluginsContentTypeId,
    runThisPluginsActivateSequense = require('./runPluginsActivateSequence');

module.exports = [
    grasshopperInstance.bridgetown.middleware.authorization,
    grasshopperInstance.bridgetown.middleware.authToken,
    function(request, response, next) {
        if(request.bridgetown.identity.role === 'admin') {
            next();
        } else {
            new Response(response).writeUnauthorized();
        }
    },
    _handleActivatePlugin
];

function _handleActivatePlugin(request, response) {
    var pluginIdToActivate = request.body.id,
        thisPlugin = getPossiblePlugins().find(function(plugin) { return plugin.id === pluginIdToActivate; }),
        currentPluginState,
        thisPluginsActivationPath = path.join(getProjectRootPath(), 'plugins', thisPlugin.directory, 'activate');

    if(!pluginIdToActivate) {
        new Response(response).writeError({ message : 'You must send a plugin ID.', code : 400 });
    } else if(!_pluginExists(pluginIdToActivate)){
        new Response(response).writeError({ message : 'The plugin you wanted to activate does not exist.', code : 400 });
    } else {

        _getThisPluginFromDb(pluginIdToActivate)
            .then(function(thisPluginFromDb) {
                currentPluginState = thisPluginFromDb;

                if(currentPluginState && currentPluginState.fields.active) {
                    new Response(response).writeError({ message : 'The plugin you wanted to activate is already active.', code : 400 });
                } else if(fs.existsSync(thisPluginsActivationPath)) {
                    new Response(response).writeError({ message : 'This plugin does not have an activation script.', code : 400 });
                } else {

                    console.log('Activating Plugin : '+ thisPlugin.title);
                    runThisPluginsActivateSequense(thisPluginsActivationPath)
                        .then(_activePluginInDB(pluginIdToActivate))
                        .then(function(activationBody) {
                            new Response(response).writeSuccess(activationBody);
                        })
                        .catch(function(err) {
                            new Response(response).writeError('Plugin could not be activated '+ err);
                        });
                }
            });
    }
}

function _pluginExists(pluginIdToActive) {
    return !!getPossiblePlugins().find(function(plugin) {
        return plugin.id === pluginIdToActive;
    });
}

function _getThisPluginFromDb(pluginIdToActivate) {
    var thisPlugin = getPossiblePlugins()
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
                        value : getPluginsContentTypeId()
                    }
                ]
            })
            .then(function(queryResults) {
                return queryResults.results.find(function(result) {
                    return result.fields.directory === thisPlugin.directory;
                });
            });
}

function _activePluginInDB(pluginIdToActivate) {
    return function(activationBody) {
        var thisPlugin = getPossiblePlugins()
                .find(function(plugin) {
                    return plugin.id === pluginIdToActivate;
                });

        return _getThisPluginFromDb(pluginIdToActivate)
            .then(function(thisPluginFromDb) {

                if(thisPluginFromDb) {

                    return grasshopperInstance
                            .request
                            .content
                            .update(defaultsDeep({
                                fields : {
                                    active : true
                                }
                            }, thisPluginFromDb))
                            .then(function() {
                                return activationBody;
                            });

                } else {

                    return grasshopperInstance
                            .request
                            .content
                            .insert({
                                meta : {
                                    type : getPluginsContentTypeId(),
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