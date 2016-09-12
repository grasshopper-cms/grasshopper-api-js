'use strict';

var commerceSingleton = require('./commerceSingleton'),
    express = require('express'),
    path = require('path'),
    commerceContentTypes = require('./commerceContentTypes');

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the Commerce plugin');

    commerceSingleton.grasshopper = grasshopperInstance;

    console.log('Adding GET admin/example route to api routes.');
    commerceSingleton.grasshopper.admin.use('/plugins/commerce/', express.static(path.join(__dirname, 'assets')));

    commerceSingleton.grasshopper.admin.get('/commerce/products', require('./views/products').get);
    commerceSingleton.grasshopper.admin.get('/commerce/reports', require('./views/reports').get);
    commerceSingleton.grasshopper.admin.get('/commerce/orders', require('./views/orders').get);
    commerceSingleton.grasshopper.admin.get('/commerce/options', require('./views/options').get);

    // Add the Commerce Product Type.
    return _ensureCommerceProductType()
        .then(function(commerceProductTypeId) {
            commerceSingleton.commerceProductTypeId = commerceProductTypeId;
        })
        .then(_ensureCommerceOptionsType)
        .then(function(commerceOptionsTypeId) {
            commerceSingleton.commerceOptionsTypeId = commerceOptionsTypeId;
        });
};


function _ensureCommerceProductType() {
    return commerceSingleton.grasshopper
        .request
        .contentTypes
        .list() // Cannot query content types yet.
        .then(function(queryResults) {
            var found = queryResults
                    .results
                    .find(function(contentType) {
                        return contentType.label === commerceContentTypes.commerceProduct.label;
                    });

            if(found) {
                console.log('Found Commerce Product Type. No Need to add it.');
                return found._id.toString();
            } else {
                console.log('Could not find Commerce Product Content Type, inserting now');
                return commerceSingleton.grasshopper
                    .request
                    .contentTypes
                    .insert(commerceContentTypes.commerceProduct)
                    .then(function(newContentType) {
                        console.log('Finished inserting Commerce Product Content Type');
                        return newContentType._id.toString();
                    });
            }
        });
}

function _ensureCommerceOptionsType() {
    return commerceSingleton.grasshopper
        .request
        .contentTypes
        .list() // Cannot query content types yet.
        .then(function(queryResults) {
            var found = queryResults
                    .results
                    .find(function(contentType) {
                        return contentType.label === commerceContentTypes.options.label;
                    });

            if(found) {
                console.log('Found Commerce Options Type. No Need to add it.');
                return found._id.toString();
            } else {
                console.log('Could not find Commerce Options Content Type, inserting now');

                commerceContentTypes.options.fields.forEach(function(field) {
                    if(field._id === 'products') {
                        field.options = commerceSingleton.commerceProductTypeId.toString();
                    }
                });

                return commerceSingleton.grasshopper
                    .request
                    .contentTypes
                    .insert(commerceContentTypes.options)
                    .then(function(newContentType) {
                        console.log('Finished inserting Commerce Options Content Type');
                        return newContentType._id.toString();
                    });
            }
        });
}