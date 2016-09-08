'use strict';

var path = require('path'),
    express = require('express'),
    grasshopper = require('./grasshopper');

module.exports = function activate(grasshopperInstance) {
    console.log(`Called activate on the ${require('./config').title} plugin`);

    grasshopper.instance = grasshopperInstance;

    console.log('Adding GET admin/example route to api routes.');
    grasshopperInstance.admin.use('/plugins/apiBrowser/', express.static(path.join(__dirname, 'assets')));
    grasshopperInstance.admin.get('/api-browser', require('./index').get);
};
