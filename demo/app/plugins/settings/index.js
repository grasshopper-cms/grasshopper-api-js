'use strict';

var fs = require('fs'),
    path = require('path'),
    defaultsDeep = require('lodash/defaultsDeep'),
    BB = require('bluebird'),
    grasshopperInstance = require('../../grasshopper/instance'),
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
    getTabsContentTypeId : getTabsContentTypeId,
    getPluginsContentTypeId : getPluginsContentTypeId,
    getPossiblePlugins : getPossiblePlugins
};

function onAppInit() {
    console.log('Activating the admin plugins plugin');
    return activate()
        .then(function(state) {

            pluginsContentTypeId = state.pluginsContentType;
            tabsContentTypeId = state.tabsContentType;
        });
}

function getPluginsContentTypeId() {
    return pluginsContentTypeId;
}

function getTabsContentTypeId() {
    return tabsContentTypeId;
}

function getPossiblePlugins() {
    return possiblePlugins;
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
