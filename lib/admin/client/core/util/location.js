'use strict';

var createBrowserHistory = require('history').createBrowserHistory,
    historyInstance = createBrowserHistory({
        basename: window.gh.configs.base
    });

module.exports =  {
    onHashChange : onHashChange,
    goTo : goTo,
    getCurrentQueryParams : getCurrentQueryParams,
    onInitialRoute : onInitialRoute,
    getCurrentLocation : getCurrentLocation
};

function onHashChange(callback) {
    historyInstance.listen(callback);
    return this;
}

function goTo(href) {
    if(href) {
        historyInstance.push(href);
    } else {
        historyInstance.push('/');
    }
    return this;
}

function getCurrentQueryParams() {
    var query = window.location.search.substring(1),
        paramStrings = query.split('&');

    return paramStrings.reduce(function(memo, paramString) {
        var splitParamString = paramString.split('=');

        memo[splitParamString[0]] = window.decodeURIComponent(splitParamString[1]);

        return memo;
    }, {});
}

function onInitialRoute(callback) {
    return callback(historyInstance.location);
}

function getCurrentLocation() {
    return historyInstance.location;
}