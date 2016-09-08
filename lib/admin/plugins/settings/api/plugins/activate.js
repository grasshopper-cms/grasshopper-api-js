'use strict';

var grasshopper = require('../../grasshopper'),
    Response = grasshopper.instance.bridgetown.Response,
    path = require('path'),
    fs = require('fs'),
    defaultsDeep = require('lodash/defaultsDeep'),
    runThisPluginsActivateSequense = require('./runPluginsActivateSequence'),
    _addThisPluginsTabs = require('./_addThisPluginsTabs');

module.exports = [
    grasshopper.instance.bridgetown.middleware.authorization,
    grasshopper.instance.bridgetown.middleware.authToken,
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
        thisPlugin = grasshopper.instance.state.possiblePlugins.find(function(plugin) { return plugin.id === pluginIdToActivate; }),
        currentPluginState,
        thisPluginsActivationPath = path.join(grasshopper.instance.state.projectRootPath, 'plugins', thisPlugin.directory, 'activate');

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
                    return runThisPluginsActivateSequense(thisPluginsActivationPath)
                        .then(_activePluginInDB(pluginIdToActivate))
                        .then(_addThisPluginsTabs(thisPlugin))
                        .then(function(activationBody) {
                            new Response(response).writeSuccess(activationBody);
                        });
                }
            })
            .catch(function(err) {
                console.log('activation error:', err);
                new Response(response).writeError('Plugin could not be activated '+ err);
            });
    }
}

function _pluginExists(pluginIdToActive) {
    return !!grasshopper.instance.state.possiblePlugins.find(function(plugin) {
        return plugin.id === pluginIdToActive;
    });
}

function _getThisPluginFromDb(pluginIdToActivate) {
    var thisPlugin = grasshopper.instance.state.possiblePlugins
            .find(function(plugin) {
                return plugin.id === pluginIdToActivate;
            });

    return grasshopper
            .instance
            .request
            .content
            .query({
                filters :[
                    {
                        key : 'meta.type',
                        cmp : '=',
                        value : grasshopper.instance.state.pluginsContentTypeId
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
        var thisPlugin = grasshopper.instance.state.possiblePlugins
                .find(function(plugin) {
                    return plugin.id === pluginIdToActivate;
                });

        return _getThisPluginFromDb(pluginIdToActivate)
            .then(function(thisPluginFromDb) {

                if(thisPluginFromDb) {

                    return grasshopper
                            .instance
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

                    return grasshopper
                            .instance
                            .request
                            .content
                            .insert({
                                meta : {
                                    type : grasshopper.instance.state.pluginsContentTypeId,
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