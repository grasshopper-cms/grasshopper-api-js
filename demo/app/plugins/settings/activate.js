'use strict';

var pluginsContentType = require('./pluginsContentType'),
    path = require('path'),
    express = require('express');

module.exports = function activatePluginsPlugin(grasshopperInstance) {
    // Add this plugins Assets DIR to the use static
    console.log('Adding the plugin plugins assets dir to the static path');
    grasshopperInstance.admin.use('/plugins/settings/', express.static(path.join(__dirname, 'assets')));

    // Query GH for for a 'plugins' content type.
    // If it does not exist, insert it.
    return grasshopperInstance
        .request
        .contentTypes
        .list() // Cannot query content types yet.
        .then(function(queryResults) {
            var foundParent = queryResults
                    .results
                    .find(function(contentType) {
                        return contentType.label === 'Plugins';
                    });

            if(foundParent) {
                console.log('Found Plugins Content Type');
                return true;
            } else {
                console.log('Could not find Plugins Content Type, inserting now');
                return grasshopperInstance
                    .request
                    .contentTypes
                    .insert(pluginsContentType)
                    .then(function() {
                        console.log('Finished inserting required Conetent Types');
                    });
            }
        })
        .catch();
};
