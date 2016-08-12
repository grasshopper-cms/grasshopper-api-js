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

function handlePluginCheck(event) {
    var pluginIdToActivate = event.currentTarget.getAttribute('plugin-id');
    window.gh.api.plugins.activate(pluginIdToActivate)
        .then(function() {
            console.log('WORKED');
        })
        .catch(function() {
            console.log('DID NOT WORK');
        });
}

domReady(init);
