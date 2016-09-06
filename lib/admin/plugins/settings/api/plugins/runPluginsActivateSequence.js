'use strict';

var grasshopper = require('../../grasshopper');

module.exports = function(thisPluginsActivationPath) {
    console.log('Activating This Plugin - ', thisPluginsActivationPath);
    return require(thisPluginsActivationPath)(grasshopper.instance);
};