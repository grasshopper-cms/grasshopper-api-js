'use strict';

var grasshopperInstance = require('../../grasshopper').instance,
    Response = grasshopperInstance.bridgetown.Response,
    defaultsDeep = require('lodash/defaultsDeep');

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
    _handleTabUpdate
];

function _handleTabUpdate(request, response) {
    var tabIdToUpdate = request.params.id || request.body.id,
        tabBody = request.body;

    if(!tabIdToUpdate) {
        new Response(response).writeError({ message : 'You must send a tab ID. Either in the route or in the body. Body overrides rout.', code : 400 });
    } else {
        grasshopperInstance
            .request
            .content
            .getById(tabIdToUpdate)
            .then(function(originalTabObject) {

                if(!originalTabObject) {
                    new Response(response).writeError({ message : 'The tab id you sent does not exist in the database.', code : 400 });
                } else {
                    grasshopperInstance
                        .request
                        .content
                        .update(defaultsDeep(tabBody, originalTabObject))
                        .then(function(theUpdatedTab) {
                            new Response(response).writeSuccess(theUpdatedTab);
                        });
                }
            });
    }
}