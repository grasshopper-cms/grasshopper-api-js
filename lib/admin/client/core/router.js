'use strict';

var routeMatchesPath = require('./util/routeMatchesPath');

module.exports = {
    match : match
};

function match(path) {
    const menuItem = window.gh.appState.get('configs.menuItems')
        .find(function(menuItem) {
            // Menu items are seeded from configs but live in the database
            return menuItem.fields.activeWhenRouteMatches.find(function(route) {
                return routeMatchesPath(route, path);
            });

        });
    return menuItem.fields.scriptSource;
}
