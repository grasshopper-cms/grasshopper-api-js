'use strict';

module.exports = function(hanlder) {
    _getRequestAnimationFrame()(hanlder);
};

function _getRequestAnimationFrame() {
    return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
}