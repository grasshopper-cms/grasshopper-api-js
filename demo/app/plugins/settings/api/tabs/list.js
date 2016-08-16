'use strict';

var grasshopperInstance = require('../../../../grasshopper/instance'),
    Response = grasshopperInstance.bridgetown.Response,
    getTabsContentTypeId = require('../../index').getTabsContentTypeId;

module.exports = [
    grasshopperInstance.bridgetown.middleware.authorization,
    grasshopperInstance.bridgetown.middleware.authToken,
    function(request, response, next) {
        if(request.bridgetown.identity.role === 'admin') {
            next();
        } else {
            new Response(response).writeUnauthorized();
        }
    },
    _handleGetTabs
];

function _handleGetTabs(request, response) {
    grasshopperInstance
        .request
        .content
        .query({
            filters :[
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : getTabsContentTypeId()
                }
            ]
        })
        .then(function(queryResults) {
            new Response(response).writeSuccess(queryResults.results);
        });
}