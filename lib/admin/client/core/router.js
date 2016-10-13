'use strict';

var routeMatchesPath = require('./util/routeMatchesPath');

module.exports = {
    match : match
};

function match(path) {
    return window.gh.appState.get('configs.menuItems')
        .filter(function(menuItem) {
            console.log('The menu item is:', menuItem);
            return menuItem.fields.activeWhenRouteMatches
                .reduce(function(memo, route) {
                    if(routeMatchesPath(route, path)) {
                        memo = true;
                    }
                    return memo;
                }, false);
        })
        .reduce(function(memo, menuItem) {
            memo = menuItem.fields.partials[Object.keys(menuItem.fields.partials)[0]];
            console.log('Admin Router Matched, ', path, ' with the partial path ', memo);
            return memo;
        }, '');
}
