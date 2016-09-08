'use strict';

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the content plugin');

    grasshopperInstance.admin.get(['/items', '/items*'], require('./index').get);
};