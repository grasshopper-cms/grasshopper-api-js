define(['grasshopperModel', 'resources', 'advancedSearch/content/model'], function(Model, resources, AdvancedSearchContentModel) {
    'use strict';

    return Model.extend({
        initialize : initialize,
        defaults : function() {
            return {
                resources : resources,
                searchType : null,
                queryOptions : {
                    filters : [],
                    nodes : [],
                    types : [],
                    options : {
                        limit : 1000,
                        skip : 0
                    }
                },
                contentSearchModel : null
            };
        }
    });

    function initialize() {
        Model.prototype.initialize.apply(this, arguments);

        this.set('contentSearchModel', new AdvancedSearchContentModel());

        this.get('contentSearchModel').set('queryOptions', this.get('queryOptions'));
    }
});
