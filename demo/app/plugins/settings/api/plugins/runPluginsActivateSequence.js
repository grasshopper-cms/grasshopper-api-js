'use strict';

module.exports = function(thisPluginsActivationPath) {
    console.log('Activating This Plugin - ', thisPluginsActivationPath);
    return require(thisPluginsActivationPath)();
};