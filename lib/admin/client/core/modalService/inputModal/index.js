'use strict';

var baseModal = require('../baseModal'),
    defaultsDeep = require('lodash/defaultsDeep');

module.exports = function() {
    return defaultsDeep({
        events : {
            'beforeTemplating' : [onBeforeTemplating],
            'beforeShow' : [onBeforeShow],
            'showing' : [onShowing],
            'afterShow' : [onAfterShow],
            'wantsToClose' : [onWantsToClose],
            'beforeHide' : [onBeforeHide],
            'hiding' : [onHiding],
            'afterHide' : [onAfterHide],
            'beforeDestroy' : [onBeforeDestroy]
        }
    }, baseModal);
};

function onBeforeTemplating() {
    console.log('ON BEFORE TEMPLATING FROM THE INSTANCE');
}

function onBeforeShow() {
    console.log('ON AFTER RENDER FROM THE INSTANCE');
}

function onShowing() {
    console.log('ON SHOWING');
}

function onAfterShow() {
    console.log('ON AFTER SHOW');
    console.log('THE MODEL IS, '+ this.model);
}

function onWantsToClose() {
    console.log('ON WANTS TO CLOSE FROM THE INSTANCE');
}

function onBeforeHide() {
    console.log('ON BEFORE HIDE FROM THE INSTANCE');
}

function onHiding() {
    console.log('ON HIDING FROM THE INSTANCE');
}

function onAfterHide() {
    console.log('ON AFTER HIDE FROM THE INSTANCE');
}

function onBeforeDestroy() {
    console.log('ON BEFORE DESTROY FROM THE INSTANCE');
}