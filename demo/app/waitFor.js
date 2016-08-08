'use strict';
const grasshopperInstance = require('./grasshopper/instance');

module.exports = function waitFor() {
    return grasshopperInstance.waitFor;
};
