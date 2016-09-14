'use strict';

var appState = require('app-state').init(),
    api = require('./api'),
    modalService = require('./modalService'),
    ghaConfigs = window.gh.configs,
    log = require('./util/log'),
    alert = require('./util/alert'),
    localStorage = require('./util/localstorage');

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
window.gh.modalService = modalService;
window.gh.log = log;
window.gh.alert = alert;
window.gh.localStorage = localStorage;

appState('loading', true);
api.user.me()
    .then(function(res) {
        appState('user', res);
    })
    .then(api.tabs.list)
    .then(function(tabsList) {
        appState('configs.menuItems', tabsList);
        appState('loading', false);
    });


// FOR TESTING THE INPUT MODAL
// var inputModal = window.gh.modalService.showInputModal('What is your name?')
//     .on('wantsToClose', function(state, allowToHide) {
//         if(state.model.message === 'What is your name?') {
//             console.log('Modal 1 is closing');
//             allowToHide();
//         }
//     });
//
// var secondInputModal = window.gh.modalService.showInputModal('What is your name?')
//     .on('wantsToClose', function(state, allowToHide) {
//         if(state.model.message === 'What is your name?') {
//             allowToHide();
//         }
//     });
//
// setTimeout(function() {
//     inputModal.close();
// }, 3000);

