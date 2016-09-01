'use strict';

var grasshopperInstance = require('../../grasshopper').instance,
    BB = require('bluebird'),
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
    BB.all(_flatten(request.body.nestedTabIds
        .map(function(parentTab, parentIndex) {
            var thisTabsPromises = [];

            thisTabsPromises.push(_updateTab(parentTab._id, parentIndex, null));

            parentTab.childTabs.forEach(function(childTab, childIndex) {
                thisTabsPromises.push(_updateTab(childTab._id, childIndex, parentTab._id));
            });

            return thisTabsPromises;
        })))
        .then(function() {
            new Response(response).writeSuccess('Updated Tabs');
        })
        .catch(function(err) {
            new Response(response).writeError('Could not update tabs '+ err.toString());
        });
}

function _flatten(array) {
    return array.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? _flatten(toFlatten) : toFlatten);
    }, []);
}

function _updateTab(tabId, sort, parent) {
    return grasshopperInstance
        .request
        .content
        .getById(tabId)
        .then(function(originalTabObject) {
            originalTabObject.fields.sort = parseInt(sort);

            if(parent) {
                originalTabObject.fields.ancestors = new Array(parent);
            } else {
                delete originalTabObject.fields.ancestors;
            }

            if(originalTabObject) {
                return grasshopperInstance
                    .request
                    .content
                    .update(originalTabObject);
            }
        });
}

