'use strict';

var grasshopper = require('../../grasshopper'),
    Response = grasshopper.instance.bridgetown.Response,
    defaultsDeep = require('lodash/defaultsDeep');

module.exports = [
    grasshopper.instance.bridgetown.middleware.authorization,
    grasshopper.instance.bridgetown.middleware.authToken,
    function(request, response, next) {
        if(request.bridgetown.identity.role === 'admin') {
            next();
        } else {
            new Response(response).writeUnauthorized();
        }
    },
    _handleTabActivation
];

function _handleTabActivation(request, response) {
    var tabIdToActivate = request.params.id || request.body.id,
        currentTabStateInDb;

    if(!tabIdToActivate) {
        new Response(response).writeError({ message : 'You must send a tab ID.', code : 400 });
    } else {
        grasshopper
            .instance
            .request
            .content
            .getById(tabIdToActivate)
            .then(function(tab) {
                currentTabStateInDb = tab;

                if(!currentTabStateInDb) {
                    new Response(response).writeError({ message : 'The tab id you sent does not exist in the database.', code : 400 });
                } else if(currentTabStateInDb.fields.active) {
                    new Response(response).writeSuccess({ message : 'The tab id you sent is already active.', code : 400 });
                } else {
                    grasshopper
                        .instance
                        .request
                        .content
                        .update(defaultsDeep({
                            fields : {
                                active : true
                            }
                        }, currentTabStateInDb))
                        .then(function(updatedTab) {
                            new Response(response).writeSuccess(updatedTab);
                        });
                }
            });
    }
}