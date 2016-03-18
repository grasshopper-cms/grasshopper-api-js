define(['paginatedCollection', 'constants', 'api',
    'contentDetailViewModel', 'moment'],
    function (PaginatedCollection, constants, api,
              contentDetailViewModel, moment) {

    'use strict';

    return PaginatedCollection.extend({
        model : contentDetailViewModel,
        nodeId : '',
        url : function() {
            return constants.api.nodesContent.url.replace(':id', this.nodeId);
        },
        comparator : function(modelA, modelB) { //Ascending
            var modelALabel = modelA.get('fields.'+ modelA.get('meta.labelfield') ).toLowerCase(),
                modelBLabel = modelB.get('fields.'+ modelB.get('meta.labelfield') ).toLowerCase();

            return modelALabel.localeCompare(modelBLabel);
        },
        limit : parseInt(constants.pagination.defaultLimit, 10 ),
        skip : parseInt(constants.pagination.defaultSkip, 10 ),
        filtersKey : 'virtual.label',
        queryRequest : api.makeQuery,

        sortByLabelAscending : sortByLabelAscending,
        sortByLabelDescending : sortByLabelDescending,
        sortByTypeAscending : sortByTypeAscending,
        sortByTypeDescending : sortByTypeDescending,
        sortByModifiedAscending : sortByModifiedAscending,
        sortByModifiedDescending : sortByModifiedDescending
    });

    function sortByLabelAscending() {
        this.comparator = function(modelA, modelB) {
            var modelALabel = modelA.get('fields.'+ modelA.get('meta.labelfield') ).toLowerCase(),
                modelBLabel = modelB.get('fields.'+ modelB.get('meta.labelfield') ).toLowerCase();

            return modelALabel.localeCompare(modelBLabel);
        };
        this.sort();
    }

    function sortByLabelDescending() {
        this.comparator = function(modelA, modelB) {
            var modelALabel = modelA.get('fields.'+ modelA.get('meta.labelfield') ).toLowerCase(),
                modelBLabel = modelB.get('fields.'+ modelB.get('meta.labelfield') ).toLowerCase();

            return modelBLabel.localeCompare(modelALabel);
        };
        this.sort();
    }

    function sortByTypeAscending() {
        this.comparator = function(modelA, modelB) {
            return modelA.get('meta.typelabel').toLowerCase().localeCompare(modelB.get('meta.typelabel').toLowerCase());
        };
        this.sort();
    }

    function sortByTypeDescending() {
        this.comparator = function(modelA, modelB) {
            return modelB.get('meta.typelabel').toLowerCase().localeCompare(modelA.get('meta.typelabel').toLowerCase());
        };
        this.sort();
    }

    function sortByModifiedAscending() {
        this.comparator = function(modelA, modelB) {
            if(moment(modelA.get('meta.lastmodified')).isBefore(modelB.get('meta.lastmodified'))) {
                return -1;
            }
            if(moment(modelA.get('meta.lastmodified')).isAfter(modelB.get('meta.lastmodified'))) {
                return 1;
            }
            return 0;
        };
        this.sort();
    }

    function sortByModifiedDescending() {
        this.comparator = function(modelA, modelB) {
            if(moment(modelA.get('meta.lastmodified')).isBefore(modelB.get('meta.lastmodified'))) {
                return 1;
            }
            if(moment(modelA.get('meta.lastmodified')).isAfter(modelB.get('meta.lastmodified'))) {
                return -1;
            }
            return 0;
        };
        this.sort();
    }
});
