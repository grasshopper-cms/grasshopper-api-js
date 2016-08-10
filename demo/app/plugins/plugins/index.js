'use strict';

var fs = require('fs'),
    path = require('path'),
    extend = require('lodash/extend'),
    grasshopperInstance = require('../../grasshopper/instance'),
    possiblePlugins = fs
        .readdirSync(path.join(__dirname, '..', '..', 'plugins'))
        .filter(function(dirname) {
            return dirname !== 'plugins'; // Remove THIS plugin from the possible plugins
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

function post() {
    // see what the person posted, then save this to the DB.

    // Does it exist?
    // YES?
        // update it with what was passed.


    // NO
        // Make a piece of content for this setting plugin setting it to true.


    // if it wanted to be active, run that active for the plugin in question
}