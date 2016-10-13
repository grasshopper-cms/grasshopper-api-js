'use strict';

const grasshopper = require('../../grasshopper');
const BB = require('bluebird');
const chalk = require('chalk');

module.exports = function(thisPluginsActivationPath) {
    console.log(chalk.green('Activating This Plugin - ', thisPluginsActivationPath));
    return BB.resolve(require(thisPluginsActivationPath)(grasshopper.instance));
};