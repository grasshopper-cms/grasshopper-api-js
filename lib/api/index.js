/**
 * Module that is a proxy for all entity modules
 * Usage: api.proxy('users').<method>
 */
module.exports = function(app){
    "use strict";

    var bridgetown = require('bridgetown-api'),
        tokens = require('../entities/tokens');


    require('./routes/token')(app);
    require('./routes/users')(app);
    require('./routes/contentTypes')(app);
    require('./routes/content')(app);
    require('./routes/nodes')(app);

    bridgetown.configure(function(){
        this.validate.token(tokens.validate);
    });
};