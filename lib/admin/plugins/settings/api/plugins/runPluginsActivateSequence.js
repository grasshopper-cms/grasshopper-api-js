'use strict';

module.exports = function(thisPluginsActivationPath, grasshopperInstance) {
    console.log('Activating This Plugin - ', thisPluginsActivationPath);
    return require(thisPluginsActivationPath)(grasshopperInstance);
};