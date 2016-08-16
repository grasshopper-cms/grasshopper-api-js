'use strict';

var rivets = require('rivets'),
    queryString = require('query-string'),
    domReady = require('domready'),
    view = {
        plugins : window.plugins,
        activeTab : 'general',

        tabs : window.tabs,

        subViews : {
            general : 'general',
            plugins : 'plugins',
            tabs : 'tabs'
        },

        handlePluginCheck : handlePluginCheck,
        handleTabClicked : handleTabClicked,
        handleMenuItemsToggled : handleMenuItemsToggled
    };

function init() {
    view.activeTab = queryString.parse(window.location.hash).tab || view.activeTab;

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

function handlePluginCheck(event, context) {
    context.plugin.workingType = context.plugin.active ? 'Activating' : 'Deactivating'; // Reversed because rivets has allready set the value;
    context.plugin.isWorking = true;

    window.gh.api.plugins[context.plugin.active ? 'activate' : 'deactivate'](context.plugin.id)
        .then(function(activationPayload) {
            console.log(activationPayload);
            context.plugin.isWorking = false;

            return window.gh.api.menuTabs.list();
        })
        .then(function(menuTabs) {
            window.gh.appState.set('configs.menuItems', menuTabs);
            view.tabs = menuTabs;
        })
        .catch(function() {
            context.plugin.isWorking = false;
            context.plugin.active = !context.plugin.active;

            window.gh.alert('Plugin Activation Failed. ');
        });
}

function handleMenuItemsToggled(event, context) {
    context.tab.workingType = context.tab.fields.active ? 'Activating' : 'Deactivating'; // Reversed because rivets has allready set the value;
    context.tab.isWorking = true;

    window.gh.api.menuTabs[context.tab.fields.active ? 'activate' : 'deactivate'](context.tab._id)
        .then(function() {
            context.tab.isWorking = false;
            return window.gh.api.menuTabs.list();
        })
        .then(function(menuTabs) {
            window.gh.appState.set('configs.menuItems', menuTabs);
            view.tabs = menuTabs;
        });
}

domReady(init);
