'use strict';

var fs = require('fs'),
    path = require('path'),
    defaultsDeep = require('lodash/defaultsDeep'),
    BB = require('bluebird'),
    activate = require('./activate'),
    queryTabs = require('./api/tabs/_queryTabs'),
    nestChildTabsTransform = require('./api/tabs/_nestChildTabsTransform'),
    applyTabSort = require('./api/tabs/_applyTabsSort'),
    runThisPluginsActivateSequense = require('./api/plugins/runPluginsActivateSequence'),
    grasshopper = require('./grasshopper');

module.exports = {
    get : getMiddleware,

    onAppInit : onAppInit
};

function onAppInit(options, instance) {

    grasshopper.instance = instance;
    grasshopper.instance.state.projectRootPath = options.projectRootPath;

    grasshopper.instance.state.possiblePlugins = fs
        .readdirSync(path.join(grasshopper.instance.state.projectRootPath, 'plugins'))
        .filter(function(dirname) {
            return dirname !== 'setting'; // Remove THIS plugin from the possible plugins
        })
        .map(function(dirname) {
            return require(path.join(grasshopper.instance.state.projectRootPath, 'plugins', dirname, 'config.js'));
        });

    return activate(grasshopper.instance)
        .then(function(state) {
            grasshopper.instance.state.pluginsContentTypeId = state.pluginsContentType;
            grasshopper.instance.state.tabsContentTypeId = state.tabsContentType;
        })
        .then(_reactivateActivePluginsFromDb)
        .catch(function(err) {
            console.log('activation error', err);
        });
}

function getMiddleware(request, response) {
    BB.join(_getActivePlugins(), _getTabs(),
        function(theseActivePlugins, tabs) {
            response.render(require.resolve('./template.pug'),
                defaultsDeep(response.locals, {
                    plugins : grasshopper
                        .instance
                        .state
                        .possiblePlugins
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
                },
                {
                    key : 'fields.active',
                    cmp : '=',
                    value : true
                }
            ]
        })
        .then(function(queryResults) {
            return queryResults
                .results;
        });
}

function _getTabs() {
    return queryTabs()
        .then(nestChildTabsTransform)
        .then(applyTabSort)
        .catch(function(err) {
            console.log('TABS QUERY FAILED - '+ err.toString());
        });
}

function _reactivateActivePluginsFromDb() {
    return _getActivePlugins()
        .then(function(plugins) {
            return BB.all(plugins
                    .map(function(plugin) {
                        return runThisPluginsActivateSequense(path.join(grasshopper.instance.state.projectRootPath, 'plugins', plugin.fields.directory, 'activate'), grasshopper.instance);
                    }));
        });
}
