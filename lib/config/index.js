/**
 * The config module is responsible for setting any constant variable that is needed in the application. There are
 * 3 ways to set the configuration values for grasshopper.
 *
 * 1) Include a configuration.json file in lib/config folder
 * 2) Include a ghapi.json file in the root of your application
 * 3) Set an environment variable with GHCONFIG (soon to be deprecated) or GRASSHOPPER_CONFIG
 */
module.exports = (function(){
    'use strict';

    var findup = require('findup-sync'),
        internal = {},
        configString = process.argv.length == 3 && process.argv[2] == 'test' ?
            './configuration.test.json' : './configuration.json',
        config;

    if(process.env.GHCONFIG){
        console.log('Configuration found in the environment. Using config set in process.env');
        config = JSON.parse(process.env.GHCONFIG);
    }
    else if(process.env.GRASSHOPPER_CONFIG){
        console.log('Configuration found in the environment. Using config set in process.env');
        config = JSON.parse(process.env.GRASSHOPPER_CONFIG);
    }
    else {
        try {
            config = require.resolve(configString);
        } catch(e) {
            console.log('Looking for ghapi.json file for configuration...');
            config = findup('*/ghapi.json');
        }

        config = require(config);
    }

    internal.config = config;

    config.get = function(moduleName){
        return internal.config[moduleName];
    };

    return config;
})();

