module.exports = function(httpRequest, httpResponse, next){
    'use strict';
    httpResponse.setHeader('Access-Control-Allow-Origin', '*');
    httpResponse.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    httpResponse.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
};
