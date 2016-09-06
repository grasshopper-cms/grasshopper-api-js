'use strict';

var fs = require('fs'),
    path = require('path'),
    defaultsDeep = require('lodash/defaultsDeep'),
    BB = require('bluebird'),
    grasshopperInstance,
    activate = require('./activate'),
    queryTabs = require('./api/tabs/_queryTabs'),
    nestChildTabsTransform = require('./api/tabs/_nestChildTabsTransform'),
    applySort = require('./api/tabs/_applySort'),
    runThisPluginsActivateSequense = require('./api/plugins/runPluginsActivateSequence'),
    pluginsContentTypeId = null,
    tabsContentTypeId = null,
    possiblePlugins,
    projectRootPath;

module.exports = {
    get : get,

    onAppInit : onAppInit,
    getTabsContentTypeId : getTabsContentTypeId,
    getPluginsContentTypeId : getPluginsContentTypeId,
    getPossiblePlugins : getPossiblePlugins,
    getProjectRootPath : getProjectRootPath
};

function onAppInit(options, instance) {

    // Could these be scoped better?
    grasshopperInstance = instance;
    projectRootPath = options.projectRootPath;

    console.log('loading possible plugins');
    possiblePlugins = fs
        .readdirSync(path.join(projectRootPath, 'plugins'))
        .filter(function(dirname) {
            return dirname !== 'settings'; // Remove THIS plugin from the possible plugins
        })
        .map(function(dirname) {
            return require(path.join(projectRootPath, 'plugins', dirname, 'config.js'));
        });
    console.log('Activating the admin plugins plugin');
    return activate(grasshopperInstance)
        .then(function(state) {

            pluginsContentTypeId = state.pluginsContentType;
            tabsContentTypeId = state.tabsContentType;
        })
        .then(_reactivateActivePluginsFromDb)
        .catch(function(err) {
            console.log('activation error', err);
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

function getProjectRootPath() {
    return projectRootPath;
}

function get(request, response) {
    BB.join(_getActivePlugins(), _getTabs(),
        function(theseActivePlugins, tabs) {
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
                    tabs : tabs
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
                        return runThisPluginsActivateSequense(path.join(projectRootPath, 'plugins', plugin.fields.directory, 'activate'), grasshopperInstance);
                    }));
        });
}
