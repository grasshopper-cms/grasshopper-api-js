'use strict';

module.exports = function(handler) {
    _getRequestAnimationFrame()(handler);

};

function _getRequestAnimationFrame() {
    return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
}