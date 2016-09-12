'use strict';

var grasshopper = require('./grasshopper'),
    express = require('express'),
    path = require('path');

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the Commerce plugin');

    grasshopper.instance = grasshopperInstance;

    console.log('Adding GET admin/example route to api routes.');
    grasshopperInstance.admin.use('/plugins/commerce/', express.static(path.join(__dirname, 'assets')));

    grasshopperInstance.admin.get('/commerce/products', require('./views/products').get);
    grasshopperInstance.admin.get('/commerce/reports', require('./views/reports').get);
    grasshopperInstance.admin.get('/commerce/orders', require('./views/orders').get);
    grasshopperInstance.admin.get('/commerce/options', require('./views/options').get);
};