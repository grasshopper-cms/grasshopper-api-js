'use strict';

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the content types plugin');

    grasshopperInstance.admin.get('/content-types/*', require('./index').get);
};
