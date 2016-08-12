'use strict';

var fs = require('fs'),
    path = require('path'),
    extend = require('lodash/extend'),
    grasshopperInstance = require('../../grasshopper/instance'),
    Response = grasshopperInstance.bridgetown.Response,
    activate = require('./activate'),
    BB = require('bluebird'),
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

    onAppInit : onAppInit
};

function onAppInit() {
    console.log('Activating the admin plugins plugin');
    return activate(grasshopperInstance)
        .then(function() {
            console.log('Adding POST admin/settings route to api routes.');
            grasshopperInstance.router.post('/admin/settings', [
                grasshopperInstance.bridgetown.middleware.authorization,
                grasshopperInstance.bridgetown.middleware.authToken,
                function(request, response, next) {
                    if(request.bridgetown.identity.role === 'admin') {
                        next();
                    } else {
                        new Response(response).writeUnauthorized();
                    }
                },
                _handleSettingsPost
            ]);
        });
}

function get(request, response) {
    grasshopperInstance
        .request
        .content
        .query({
            filters :[
                {
                    key : 'meta.typelabel',
                    cmp : '=',
                    value : 'Plugins'
                },
                {
                    key : 'fields.active',
                    cmp : '=',
                    value : true
                }
            ]
        })
        .then(function(result) {
            response.render(require.resolve('./template.pug'),
                extend({
                    plugins : possiblePlugins
                        .map(function(possiblePlugin) {
                            possiblePlugin.active = !!result
                                .results
                                .find(function(activePlugin) {
                                    return activePlugin.fields.title === possiblePlugin.name;
                                });

                            return possiblePlugin;
                        })
                }, response.locals));
        });
}

function _handleSettingsPost(request, response) {
    var pluginIdToActivate = request.body.id;

    if(!pluginIdToActivate) {
        new Response(response).writeError({ message : 'You must send a plugin ID.', code : 400 });
    } else if(!_pluginExists(pluginIdToActivate)){
        new Response(response).writeError({ message : 'The plugin you wanted to activate does not exist.', code : 400 });
    } else {
        _activateOrDeactivatePlugin(response, pluginIdToActivate)
            .then(_activePluginInDB(response, pluginIdToActivate))
            .then(function() {
                new Response(response).writeSuccess('YEAH BUDDY');
            })
            .catch(function() {
                new Response(response).writeError('YEAH BUDDY');
            });
    }
}

function _pluginExists(pluginIdToActive) {
    return !!possiblePlugins.find(function(plugin) {
        console.log(plugin.id);
        console.log(plugin.id === pluginIdToActive);
        console.log(pluginIdToActive);
        return plugin.id === pluginIdToActive;
    });
}

function _activateOrDeactivatePlugin(pluginIdToActive) {
    // Does it exist?
    // YES?
    //     update it with what was passed.
    //
    //
    // NO
    //     Make a piece of content for this setting plugin setting it to true.
    return BB.resolve();
}

function _activePluginInDB(response, pluginIdToActive) {
    return function() {
        // if is in db and currently active, call the deactiveate

        // should actually call the plugins activate
        return BB.resolve();
    };
}







// module.exports = function(request, response, next) {
//     if(request.bridgetown.identity.role === 'admin') {
//         next();
//     } else {
//         grasshopperInstance.bridgetown.Response.writeUnauthorized(response);
// middleware.identity,
// middleware.nodes.setNodeIdFromArgument,
// middleware.nodes.requireNodePermissions(security.roles.AUTHOR),
// middleware.content.convertType,
// middleware.content.prepareEvent,
// middleware.event('parse'),
// middleware.event('validate'),
// middleware.content.validate,
// middleware.content.setComputedProperties,
// middleware.content.update,
// middleware.event('out'),
// middleware.event('save')

// var self = this,
//     deferred = q.defer();
//
// this.model.create(obj, function(err, doc){
//     if(err) {
//         deferred.reject(self.handleError(err));
//     } else {
//
//         self.getById(doc._id, options)
//             .then(function(cleanObj){
//                 deferred.resolve(cleanObj);
//             })
//             .fail(function(err){
//                 deferred.reject(createError(err));
//             });
//     }
// });
//
// return deferred.promise;

// var api = {},
//     grasshopper = require('grasshopper-core'),
//     bridgetown = require('bridgetown-api'),
//     Response = bridgetown.Response,
//     middleware = bridgetown.middleware;
//
// api.getById = function (httpRequest, httpResponse){
//     var promise = grasshopper.request(httpRequest.bridgetown.token).content.getById(httpRequest.params.id);
//     new Response(httpResponse).writeFromPromise(promise);
// };
