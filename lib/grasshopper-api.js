var express = require('express'),
    app = express(),
    config = require('./config/configuration.json'),
    sdk = require('./grasshopper-sdk'),
    internalSdk = new sdk(require('./config/configuration')),
    grasshopper = null,
    LOGGING_CATEGORY = "EXPRESS_SERVICE";

internalSdk.on('ready', function(val){
    grasshopper = val;
    grasshopper.log.info(LOGGING_CATEGORY, "GRASSHOPPER SDK LOADED!!!!!!");
});

internalSdk.on('failed', function(err){
    console.log("Could not load grasshopper.");
    console.log(err);
});

app.listen(3000);
console.log('Listening on port 3000...');
