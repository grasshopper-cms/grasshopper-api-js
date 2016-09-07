'use strict';

var log = require('../util/log');

module.exports = function(appStateInstance) {
    window.appState = appStateInstance;
    return {
        showInputModal : showInputModal
    };
};

function showInputModal() {
    log.write('NOT IMPLEMENTED');
}