'use strict';

var path = require('path');

module.exports = {
    name : 'Example',
    version : require(path.join(__dirname, 'package.json')).version,
    description : 'This is what I do?'
};