'use strict';

var pluginsContentType = require('./pluginsContentType'),
    grasshopperInstance = require('../../grasshopper/instance'),
    Response = grasshopperInstance.bridgetown.Response,
    path = require('path'),
    express = require('express');

module.exports = function activatePluginsPlugin(_handleSettingsPost) {
    // Add this plugins Assets DIR to the use static
    console.log('Adding the plugin plugins assets dir to the static path');
    grasshopperInstance.admin.use('/plugins/settings/', express.static(path.join(__dirname, 'assets')));

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

    // Query GH for for a 'plugins' content type.
    // If it does not exist, insert it.
    return grasshopperInstance
        .request
        .contentTypes
        .list() // Cannot query content types yet.
        .then(function(queryResults) {
            var found = queryResults
                    .results
                    .find(function(contentType) {
                        return contentType.label === 'Plugins';
                    });

            if(found) {
                console.log('Found Plugins Content Type');
                return found._id;
            } else {
                console.log('Could not find Plugins Content Type, inserting now');
                return grasshopperInstance
                    .request
                    .contentTypes
                    .insert(pluginsContentType)
                    .then(function(newContentType) {
                        console.log('Finished inserting required Conetent Types');
                        return newContentType._id;
                    });
            }
        })
        .catch();
};
