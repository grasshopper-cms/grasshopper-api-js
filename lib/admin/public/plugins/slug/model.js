define(['grasshopperModel', 'resources', 'grasshopperCollection'], function (Model, resources, GrasshopperCollection) {
    'use strict';

    return Model.extend({
        defaults : {
            resources : resources,
            oldSlugValue : '',
            possibleFieldsToSlug : new GrasshopperCollection()
        }
    });

});
