'use strict';

var appState = require('app-state').init(),
    api = require('./api'),
    ghaConfigs = window.ghaConfigs;

// The global state of the app, modify this, and all interested parties in client and core will respond
appState('', {
    configs : {
        homeString : ghaConfigs.homeString,
        menuItems : ghaConfigs.menuItems
    },
    loading : false,
    user : null
});

// Expose a global variable that will be available for client pages
window.gh = {
    api : api,
    appState : appState
};

appState('loading', true);
api.user.me()
    .then(function(res) {
        appState('user', res);
        appState('loading', false);
    });
