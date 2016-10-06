'use strict';

var queryString = require('querystring'),
    createBrowserHistory = require('history').createBrowserHistory,
    historyInstance = createBrowserHistory({
        basename: window.gh.configs.base
    });

module.exports =  {
    onHashChange : onHashChange,
    onInitialRoute : onInitialRoute,
    onParamsChange : onParamsChange,

    goTo : goTo,
    getCurrentQueryParams : getCurrentQueryParams,
    updateQueryParams : updateQueryParams,
    getCurrentLocation : getCurrentLocation
};

function onHashChange(callback) {
    // on call callback if the pathname changed because we dont want to reload if only a params update.
    historyInstance.listen(function(newHistoryState) {
        if(newHistoryState.pathname !== newHistoryState.state.previousPathName) {
            callback(newHistoryState);
        }
    });
    return this;
}

function onParamsChange(callback) {
    historyInstance.listen(function(newHistoryState) {
        if(newHistoryState.search !== newHistoryState.state.previousSearch) {
            callback(newHistoryState);
        }
    });
    return this;
}

function onInitialRoute(callback) {
    return callback(historyInstance.location);
}

function goTo(href) {
    if(href) {
        historyInstance.push({
            pathname : href,
            state : {
                previousPathName : historyInstance.location.pathname,
                previousSearch : historyInstance.location.search
            }
        });
    } else {
        historyInstance.push('/');
    }
    return this;
}

function getCurrentQueryParams() {
    var parsedQueryParams = queryString.parse(historyInstance.location.search);

    Object.keys(parsedQueryParams).forEach(function(key) {
        var modifiedKey = key.replace('?', ''); // for some reason that question mark is there.
        parsedQueryParams[modifiedKey] = parsedQueryParams[key];
        delete parsedQueryParams[key];
    });

    return parsedQueryParams;
}

function updateQueryParams(paramsObject) {
    historyInstance.push({
        pathname : historyInstance.location.pathname,
        search : queryString.stringify(paramsObject),
        state : {
            previousPathName : historyInstance.location.pathname,
            previousSearch : historyInstance.location.search
        }
    });
}

function getCurrentLocation() {
    return historyInstance.location;
}