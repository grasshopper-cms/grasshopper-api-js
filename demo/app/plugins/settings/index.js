'use strict';

var fs = require('fs'),
    path = require('path'),
    extend = require('lodash/extend'),
    grasshopperInstance = require('../../grasshopper/instance'),
    Response = grasshopperInstance.bridgetown.Response,
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
    post : post
};

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

function post(request, response) {
    var pluginIdToActive = request.body.id;

    if(!pluginIdToActive) {
        new Response(response).writeBadRequest('You must send a plugin ID');
    } else {
        console.log(grasshopperInstance.bridgetown.Response(response));
        new Response(response).writeSuccess({ 'duder' : 'galt' });
    }

    // see what the person posted, then save this to the DB.

    // Does it exist?
    // YES?
        // update it with what was passed.


    // NO
        // Make a piece of content for this setting plugin setting it to true.


    // if it wanted to be active, run that active for the plugin in question
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
