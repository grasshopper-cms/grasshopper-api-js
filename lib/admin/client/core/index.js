'use strict';

var appState = require('app-state').init(),
    api = require('./api'),
    modalService = require('./modalService'),
    ghaConfigs = window.gh.configs,
    log = require('./util/log'),
    alert = require('./util/alert');

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
window.gh.alert = alert;

appState('loading', true);
api.user.me()
    .then(function(res) {
        appState('user', res);
    })
    .then(api.menuTabs.list)
    .then(function(tabsList) {
        appState('configs.menuItems', tabsList);
        appState('loading', false);
    });
