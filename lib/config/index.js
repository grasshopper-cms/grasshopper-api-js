(function(){
    'use strict';

    var findup = require('findup-sync'),
        internal = {},
        configString = process.argv.length == 3 && process.argv[2] == 'test' ?
            './configuration.test.json' : './configuration.json',
        config;

    try {
        config = require.resolve(configString);
    } catch(e) {
        console.log('no config');
        config = findup('*/ghapi.json');
    }

    config = require(config);
    internal.config = config;
    console.log('config');
    console.log(config);
    config.get = function(moduleName){
        return internal.config[moduleName];
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = config;
    }
})();

