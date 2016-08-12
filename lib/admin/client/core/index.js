'use strict';

var appState = require('app-state').init(),
    api = require('./api'),
    modalService = require('./modalService'),
    ghaConfigs = window.gh.configs,
    log = require('./util/log');

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
window.gh.api = api;
window.gh.appState = appState;
window.gh.configs = window.gh.configs;
window.gh.modalService = modalService(appState);
window.gh.log = log;

appState('loading', true);
api.user.me()
    .then(function(res) {
        appState('user', res);
        appState('loading', false);
    });
