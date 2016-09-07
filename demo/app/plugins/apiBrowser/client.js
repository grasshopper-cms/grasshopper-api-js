'use strict';

var rivets = require('rivets'),
    domReady = require('domready'),
    view = {
        adminRoutes : JSON.stringify(window.adminRoutes, null, 4),
        grasshopperRoutes : JSON.stringify(window.grasshopperRoutes, null, 4)
    };

function init() {
    bindView();
}

function bindView() {
    rivets.bind(document.querySelector('#apiBrowserPlugin'), { view : view });
}

domReady(init);
