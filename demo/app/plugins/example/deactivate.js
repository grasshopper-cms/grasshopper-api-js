'use strict';

var BB = require('bluebird');

module.exports = function deactivate() {
    console.log('called deactivate on the example plugin');
    return new BB(function(resolve, reject) {
        setTimeout(function() {
            resolve({ 'state' : 'un activated' });
        }, 5000);
    });
};