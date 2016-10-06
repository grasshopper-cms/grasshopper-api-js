'use strict';

var appState = require('app-state').init(),
    api = require('./api'),
    modalService = require('./modalService'),
    ghaConfigs = window.gh.configs,
    log = require('./util/log'),
    alert = require('./util/alert'),
    router = require('./router'),
    localStorage = require('./util/localstorage'),
    location = require('./util/location'),
    requestAnimationFrame = require('./util/requestAnimationFrame'),
    BB = require('bluebird'),
    routeMatchesPath = require('./util/routeMatchesPath');


global.$ = global.jQuery = require('jquery');
require('what-input');
require('foundation-sites');
// global.$(document).foundation();

// require('foundation-sites');

// window.$(document).foundation();

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
window.gh.util = {
    location : location,
    routeMatchesPath : routeMatchesPath
};

appState('loading', true);
api.user.me()
    .then(function(res) {
        appState('user', res);
    })
    .then(api.tabs.list)
    .then(function(tabsList) {
        appState('configs.menuItems', tabsList);
    })
    .then(startHistory)
    .then(function() {
        appState('loading', false);
    })
    .catch(function(err) {
        console.error('Grasshopper Admin Startup Failure : ', err);
    });

function startHistory() {
    window.gh.util.location
        .onHashChange(function(locationObject) {
            renderView(locationObject.pathname);
        })
        .onInitialRoute(function(initialLocationObj) {
            renderView(initialLocationObj.pathname);
        });
    return true;
}

function renderView(pathName) {
    api.pagePartials.get(router.match(pathName))
        .then(function(pagePartial) {
            var $stage = document.querySelector('#stage');

            $stage.classList.add('is-rendering');

            requestAnimationFrame(function() {
                $stage.innerHTML = pagePartial;

                // http://stackoverflow.com/questions/13390588/script-tag-create-with-innerhtml-of-a-div-doesnt-work
                BB.all([].map.call($stage.querySelectorAll('script'), function(scriptTag) {
                    var newScriptElement = document.createElement('script');

                    newScriptElement.type = 'text/javascript';

                    if(!scriptTag.src) {
                        newScriptElement.appendChild(document.createTextNode(scriptTag.innerHTML));

                        scriptTag.parentElement.insertBefore(newScriptElement, scriptTag);
                        scriptTag.parentElement.removeChild(scriptTag);

                        return true;
                    } else {
                        newScriptElement.src = scriptTag.src;
                        newScriptElement.async = scriptTag.async;

                        return new BB(function(resolve) {
                            newScriptElement.onload = function() {
                                resolve();
                            };

                            scriptTag.parentElement.insertBefore(newScriptElement, scriptTag);
                            scriptTag.parentElement.removeChild(scriptTag);
                        });
                    }
                }))
                    .then(function() {
                        $stage.classList.remove('is-rendering');
                    });
            });
        })
        .catch(function(err) {
            console.error('Could not Render View Partial : ', pathName);
            console.error('The Error was, ', err);
        });
}

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
