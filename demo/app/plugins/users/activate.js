'use strict';

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the users plugin');

    grasshopperInstance.admin.get('/users/*', require('./index').get);
};