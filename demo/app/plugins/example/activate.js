'use strict';

var BB = require('bluebird');

module.exports = function activate(pipeToClient) {
    console.log('called activate on the example plugin');

    return new BB(function(resolve, reject) {
        setTimeout(function() {
            resolve({ 'state' : 'good to go' });
        }, 5000);
    });
};