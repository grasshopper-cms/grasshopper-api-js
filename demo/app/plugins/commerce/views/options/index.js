'use strict';

var BB = require('bluebird'),
    defaultsDeep = require('lodash/defaultsDeep'),
    commerceSingleton = require('../../commerceSingleton');

module.exports = {
    get : getMiddleware
};

function getMiddleware(request, response) {
    BB.join(_getAllContentTypes(), _getCommerceOptions(), function(allContentTypes, commerceOptions) {
        response.render(require.resolve('./template.pug'), defaultsDeep({
            allContentTypes : allContentTypes,
            commerceOptions : commerceOptions
        }, response.locals));
    })
    .catch(function() {
        console.log('FAILED TO FETCH THE PERTINANT PAGE DATA FOR THE COMMERCE OPTIONS PAGE');
    });
}

function _getAllContentTypes() {
    return commerceSingleton.grasshopper
        .request
        .contentTypes
        .list() // Cannot query content types yet.
        .then(function(queryResults) {
            return queryResults.results;
        });
}

function _getCommerceOptions() {
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
            return queryResults.results[0];
        });
}