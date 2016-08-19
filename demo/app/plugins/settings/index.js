'use strict';

var fs = require('fs'),
    path = require('path'),
    defaultsDeep = require('lodash/defaultsDeep'),
    BB = require('bluebird'),
    grasshopperInstance = require('../../grasshopper/instance'),
    activate = require('./activate'),
    queryTabs = require('./api/tabs/_queryTabs'),
    nestChildTabsTransform = require('./api/tabs/_nestChildTabsTransform'),
    applySort = require('./api/tabs/_applySort'),
    runThisPluginsActivateSequense = require('./api/plugins/runPluginsActivateSequence'),
    getActiveRoutes = require('./api/routes/getRoutesFromGrasshopper'),
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
        })
        .then(_reactivateActivePluginsFromDb);
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
    BB.join(_getActivePlugins(), _getTabs(), getActiveRoutes(),
        function(theseActivePlugins, tabs, activeRoutes) {
            response.render(require.resolve('./template.pug'),
                defaultsDeep(response.locals, {
                    plugins : possiblePlugins
                        .map(function(possiblePlugin) {
                            possiblePlugin.active = !!theseActivePlugins
                                .find(function(activePlugin) {
                                    return activePlugin.fields.directory === possiblePlugin.directory;
                                });

                            return possiblePlugin;
                        }),
                    tabs : tabs,
                    activeRoutes : activeRoutes
                }));
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
            return queryResults.results;
        });
}

function _getTabs() {
    return queryTabs()
        .then(nestChildTabsTransform)
        .then(applySort)
        .catch(function(err) {
            console.log('TABS QUERY FAILED - '+ err.toString());
        });
}

function _reactivateActivePluginsFromDb() {
    return _getActivePlugins()
        .then(function(plugins) {
            return BB.all(plugins
                    .map(function(plugin) {
                        return runThisPluginsActivateSequense(path.join(__dirname, '..', plugin.fields.directory, 'activate'));
                    }));
        });
}
