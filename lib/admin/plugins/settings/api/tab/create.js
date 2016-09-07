'use strict';

var grasshopper = require('../../grasshopper'),
    Response = grasshopper.instance.bridgetown.Response;

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
    _handleTabCreation
];

function _handleTabCreation(request, response) {
    var tabToCreate = request.body.newTab;

    if(!tabToCreate) {
        new Response(response).writeError({ message : 'You must send a tab to create.', code : 400 });
    } else if(!tabToCreate.title) {
        new Response(response).writeError({ message : 'You must send a tab title.', code : 400 });
    } else if(!tabToCreate.href) {
        new Response(response).writeError({ message : 'You must send a tab href.', code : 400 });
    } else if(!tabToCreate.roles) {
        new Response(response).writeError({ message : 'You must send tab roles.', code : 400 });
    }  else {
        grasshopper
            .instance
            .request
            .content
            .insert({
                meta : {
                    type : grasshopper.instance.state.tabsContentTypeId,
                    hidden : true
                },
                fields : {
                    title : tabToCreate.title,
                    active : true,
                    href : tabToCreate.href,
                    iconclasses : tabToCreate.iconclasses + ' fa',
                    roles : tabToCreate.roles,
                    addedby : request.bridgetown.identity.displayname +' - '+ Date.now(),
                    sort : 1
                }
            })
            .then(function(newTab) {
                new Response(response).writeSuccess(newTab);
            });
    }
}