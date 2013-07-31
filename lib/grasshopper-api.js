(function(){
    "use strict";

    var path = require('path'),
        log = require('solid-logger-js');

    log.init({
        adapters: [{
            type: "file",
            path: path.resolve(__dirname, "../") + "/log/.gitignore",
            application: 'grasshopper-api',
            machine: 'dev-server'
        }]
    });

    log.info('my label', 'mymessage');
})();