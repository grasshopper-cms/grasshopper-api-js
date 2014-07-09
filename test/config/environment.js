module.exports = (function(){
    'use strict';
    var path = require('path');
    process.env.GRASSHOPPER_CONFIG = '{"cache": {"path": "./cache"},"crypto": {"secret_passphrase" : "223fdsaad-ffc8-4acb-9c9d-1fdaf824af8c"},' +
    '"db": {"type": "mongodb","host": "mongodb://localhost:27017/test","database": "test","username": "","password": "","debug": false},' +
    '"assets": {"default" : "local","tmpdir" : "' + path.join(__dirname, "../tmp") + '","engines": {"local" : {"path" : "' + path.join(__dirname, "../public") +
    '","urlbase" : "http://localhost/"}}},"identities":{"google" : {"appId" : "123AppId123","secret" : "123Secret123","redirectUrl" : "/guide/login",' +
    '"scopes" : ["https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/userinfo.email"]}}}';
})();