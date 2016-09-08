'use strict';

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the Help plugin');

    grasshopperInstance.admin.get('/help', require('./index').get);
};