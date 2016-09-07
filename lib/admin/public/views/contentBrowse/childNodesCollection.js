define(['grasshopperCollection', 'resources', 'constants',
    'nodeDetailViewModel'],
    function (GrasshopperCollection, resources, constants,
              nodeDetailViewModel) {

    'use strict';

    return GrasshopperCollection.extend({
        model : nodeDetailViewModel,
        nodeId : '',
        url : function() {
            return constants.api.nodesChildren.url.replace(':id', this.nodeId);
        },
        comparator : function(modelA, modelB) {
            return modelA.get('label').toLowerCase().localeCompare(modelB.get('label').toLowerCase());
        },
        sortByLabelAscending : sortByLabelAscending,
        sortByLabelDescending : sortByLabelDescending
    });

    function sortByLabelAscending() {
        this.comparator = function(modelA, modelB) {
            return modelA.get('label').toLowerCase().localeCompare(modelB.get('label').toLowerCase());
        };
        this.sort();
    }

    function sortByLabelDescending() {
        this.comparator = function(modelA, modelB) {
            return modelB.get('label').toLowerCase().localeCompare(modelA.get('label').toLowerCase());
        };
        this.sort();
    }

});
