define(['grasshopperCollection', 'resources', 'constants',
    'assetDetailViewModel', 'moment'],
    function (GrasshopperCollection, resources, constants,
              assetDetailViewModel, moment) {

    'use strict';

    return GrasshopperCollection.extend({
        nodeId : '',
        model : function(attrs, options) {
            return new assetDetailViewModel(attrs, options);
        },
        url : function() {
            return constants.api.assets.url.replace(':id', this.nodeId);
        },
        comparator : function(modelA, modelB) {
            return modelA.get('fileName').toLowerCase().localeCompare(modelB.get('fileName').toLowerCase());
        },
        sortByLabelAscending : sortByLabelAscending,
        sortByLabelDescending : sortByLabelDescending,
        sortBySizeAscending : sortBySizeAscending,
        sortBySizeDescending : sortBySizeDescending,
        sortByModifiedAscending : sortByModifiedAscending,
        sortByModifiedDescending : sortByModifiedDescending
    });

    function sortByLabelAscending() {
        this.comparator = function(modelA, modelB) {
            return modelA.get('fileName').toLowerCase().localeCompare(modelB.get('fileName').toLowerCase());
        };
        this.sort();
    }

    function sortByLabelDescending() {
        this.comparator = function(modelA, modelB) {
            return modelB.get('fileName').toLowerCase().localeCompare(modelA.get('fileName').toLowerCase());
        };
        this.sort();
    }

    function sortBySizeAscending() {
        this.comparator = function(modelA, modelB) {
            if(modelA.get('size') > modelB.get('size')) {
                return -1;
            }
            if(modelA.get('size') < modelB.get('size')) {
                return 1;
            }
            return 0;
        };
        this.sort();
    }

    function sortBySizeDescending() {
        this.comparator = function(modelA, modelB) {
            if(modelA.get('size') > modelB.get('size')) {
                return 1;
            }
            if(modelA.get('size') < modelB.get('size')) {
                return -1;
            }
            return 0;
        };
        this.sort();
    }

    function sortByModifiedAscending() {
        this.comparator = function(modelA, modelB) {
            if(moment(modelA.get('lastmodified')).isBefore(modelB.get('lastmodified'))) {
                return -1;
            }
            if(moment(modelA.get('lastmodified')).isAfter(modelB.get('lastmodified'))) {
                return 1;
            }
            return 0;
        };
        this.sort();
    }

    function sortByModifiedDescending() {
        this.comparator = function(modelA, modelB) {
            if(moment(modelA.get('lastmodified')).isBefore(modelB.get('lastmodified'))) {
                return 1;
            }
            if(moment(modelA.get('lastmodified')).isAfter(modelB.get('lastmodified'))) {
                return -1;
            }
            return 0;
        };
        this.sort();
    }
});
