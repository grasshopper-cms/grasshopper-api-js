'use strict';

var appState = null,
    log = require('../util/log');

module.exports = function(appStateInstance) {
    appState = appStateInstance;
    return {
        showInputModal : showInputModal
    };
};

function showInputModal() {
    log.write('NOT IMPLEMENTED');
}