'use strict';

var appState = null;

module.exports = function(appStateInstance) {
    appState = appStateInstance;
    return {
        showInputModal : showInputModal
    };
};

function showInputModal() {
    console.log('WORKED');
}