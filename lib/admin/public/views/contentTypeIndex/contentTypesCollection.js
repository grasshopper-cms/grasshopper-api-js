define(['grasshopperCollection', 'resources', 'constants',
    'contentTypeDetailViewModel'],
    function (GrasshopperCollection, resources, constants,
              contentTypeDetailViewModel) {

    'use strict';

    return GrasshopperCollection.extend({
        model : contentTypeDetailViewModel,
        comparator: function(model) {
            return model.get('label').toLowerCase();
        },
        url : function() {
            return constants.api.contentTypes.url;
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
