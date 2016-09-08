'use strict';

var grasshopper = require('../../grasshopper'),
    BB = require('bluebird');

module.exports = function(thisPluginsActivationPath) {
    console.log('Activating This Plugin - ', thisPluginsActivationPath);
    return BB.resolve(require(thisPluginsActivationPath)(grasshopper.instance));
};