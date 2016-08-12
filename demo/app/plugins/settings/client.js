'use strict';

var rivets = require('rivets'),
    queryString = require('query-string'),
    domReady = require('domready'),
    view = {
        plugins : window.plugins,
        activeTab : 'general',

        tabs : {
            general : 'general',
            plugins : 'plugins'
        },

        handlePluginCheck : handlePluginCheck,
        handleTabClicked : handleTabClicked
    };

function init() {
    view.activeTab = queryString.parse(window.location.hash).tab;

    bindView();
}

function bindView() {
    rivets.formatters.equals = function(comparator, comparatee) {
        return comparator === comparatee;
    };

    rivets.bind(document.querySelector('#settings'), { view : view });
}

function handleTabClicked(event) {
    window.location.hash = queryString.stringify({ tab : event.currentTarget.getAttribute('tab-name') });
    view.activeTab = event.currentTarget.getAttribute('tab-name');
}

function handlePluginCheck() {
    window.gh.modalService.showInputModal(); // returns the modal instance.

    // modal.show()
    //     .then(function() {
    //         console.log('THEN WAS CALLED');
    //     })
    //     .catch(function() {
    //         console.log('CATCH WAS CALLED');
    //     });

    // modal.canClose() // called when the user wants to close the modal. return true if it is ok.
    //     .show() // kicks of the chain returns a promise.
    //     .then(function() { // use clicked confirm
    //         // do some work.
    //         // modal.close();
    //     })
    //     .catch(); // user clicked cancel. or closed it.

    // setTimeout(modal.hide, 5000);
    // window.gh.appState
    //     .transform('configs.menuItems')
    //     .with(function(menuItems, item) {
    //         menuItems.push(item);
    //         return menuItems;
    //     })
    //     .using({
    //         'showWhenUserRoleIncludes' : 'admin',
    //         'name' : 'Dawg',
    //         'href' : '/admin/content-types',
    //         'iconClasses' : 'fa fa-refresh fa-spin'
    //     });
}

domReady(init);
