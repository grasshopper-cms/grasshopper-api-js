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
    grasshopper = require('./grasshopper'),
    pug = require('pug');

module.exports = {
    getPartialMiddleware : getPartialMiddleware,

    onAppInit : onAppInit
};

function onAppInit(options, instance) {

    grasshopper.instance = instance;

    grasshopper.instance.state.projectRootPath = options.projectRootPath;

    grasshopper.instance.state.possiblePlugins = _getAllPossiblePluginPaths();

    return activate()
        .then(_reactivateActivePluginsFromDb)
        .catch(function(err) {
            console.log('activation error', err);
        });
}

function getPartialMiddleware(request, response) {
    if(request.params.partialName === 'root' || !request.params.partialName) {
        BB.join(_getActivePlugins(), _getTabs(),
            function(theseActivePlugins, tabs) {
                response.send(pug.renderFile(require.resolve('./client/template.pug'), defaultsDeep(response.locals, {
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
                })));
            });
    }
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
    return BB.map(_getActivePlugins(), function(plugin) {
        let thisFullDirectory = path.join(grasshopper.instance.state.possiblePlugins
            .find(function(mappedPlugin) {
                return mappedPlugin.directory === plugin.fields.directory;
            })
            .fullDirectory, 'activate');

        return runThisPluginsActivateSequense(thisFullDirectory, grasshopper.instance);
    });
}

function _getAllPossiblePluginPaths() {
    return fs
        .readdirSync(path.join(grasshopper.instance.state.projectRootPath, 'plugins'))
        .map(function(dirname) {
            var config = require(path.join(grasshopper.instance.state.projectRootPath, 'plugins', dirname, 'config.js'));

            config.fullDirectory = path.join(grasshopper.instance.state.projectRootPath, 'plugins', dirname);

            return config;
        })
        .concat(
            fs
            .readdirSync(path.join(__dirname, '..'))
            .filter(function(dirname) {
                return dirname !== require('./config').directory;
            })
            .map(function(dirname) {
                var config = require(path.join(__dirname, '..', dirname, 'config.js'));

                config.fullDirectory = path.join(__dirname, '..', dirname);

                return config;
            })
        );
}
