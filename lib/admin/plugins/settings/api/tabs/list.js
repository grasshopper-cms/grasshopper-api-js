'use strict';

var grasshopperInstance = require('../../grasshopper').instance,
    nestChildTabsTransform = require('./_nestChildTabsTransform'),
    queryTabs = require('./_queryTabs'),
    applySort = require('./_applyTabsSort'),
    Response = grasshopperInstance.bridgetown.Response;

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
    queryTabs()
        .then(nestChildTabsTransform)
        .then(applySort)
        .then(function(tabs) {
            new Response(response).writeSuccess(tabs);
        });
}

