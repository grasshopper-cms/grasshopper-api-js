'use strict';

var grasshopper = require('../../grasshopper'),
    nestChildTabsTransform = require('./_nestChildTabsTransform'),
    queryTabs = require('./_queryTabs'),
    applySort = require('./_applyTabsSort');

module.exports = [
    grasshopper.instance.bridgetown.middleware.authorization,
    grasshopper.instance.bridgetown.middleware.authToken,
    function(request, response, next) {
        if(request.bridgetown.identity.role === 'admin') {
            next();
        } else {
            new grasshopper.instance.bridgetown.Response(response).writeUnauthorized();
        }
    },
    _handleGetTabs
];

function _handleGetTabs(request, response) {
    queryTabs()
        .then(nestChildTabsTransform)
        .then(applySort)
        .then(function(tabs) {
            new grasshopper.instance.bridgetown.Response(response).writeSuccess(tabs);
        })
        .catch(function(err) {
            console.log('ERROR Could not fetch tabs list, err : '+ err.toString());
        });
}

