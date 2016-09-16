'use strict';

var commerceSingleton = require('./commerceSingleton'),
    express = require('express'),
    path = require('path'),
    commerceContentTypes = require('./commerceContentTypes');

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the Commerce plugin');

    commerceSingleton.grasshopper = grasshopperInstance;

    commerceSingleton.grasshopper.admin.use('/plugins/commerce/', express.static(path.join(__dirname, 'assets')));

    commerceSingleton.grasshopper.admin.get('/commerce/products', require('./views/products').get);
    commerceSingleton.grasshopper.admin.get('/commerce/reports', require('./views/reports').get);
    commerceSingleton.grasshopper.admin.get('/commerce/orders', require('./views/orders').get);
    commerceSingleton.grasshopper.admin.get('/commerce/options', require('./views/options').get);

    commerceSingleton.grasshopper.router.post('/admin/commerce/options/add-commerce-product', require('./api/options').addCommerceProduct);

    // Add the Commerce Product Type.
    return _ensureCommerceOptionsType()
        .then(function(commerceOptionsTypeId) {
            commerceSingleton.commerceOptionsTypeId = commerceOptionsTypeId;
        })
        .then(_ensureCommerceOptionsContent)
        .then(function(commerceOptionsContentId) {
            commerceSingleton.commerceOptionsContentId = commerceOptionsContentId;
        });
};

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

function _ensureCommerceOptionsContent() {
    return commerceSingleton.grasshopper
        .request
        .content
        .query({
            filters :[
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : commerceSingleton.commerceOptionsTypeId
                }
            ]
        })
        .then(function(queryResults) {
            var found = queryResults.results[0];

            if(found) {
                console.log('Found Commerce Options Content. No Need to add it.');
                return found._id.toString();
            } else {
                console.log('Could not find Commerce Options Content, inserting now');

                return commerceSingleton.grasshopper
                    .request
                    .content
                    .insert({
                        meta : {
                            type : commerceSingleton.commerceOptionsTypeId
                        },
                        fields : {
                            title : 'Commerce Options',
                            products : []
                        }
                    })
                    .then(function(newContent) {
                        console.log('Finished inserting Commerce Options Content');
                        return newContent._id.toString();
                    });
            }
        });
}