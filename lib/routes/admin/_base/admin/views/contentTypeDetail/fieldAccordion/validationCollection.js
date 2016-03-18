define(['grasshopperCollection', 'grasshopperModel', 'resources'],
    function(GrasshopperCollection, GrasshopperModel, resources) {
    'use strict';

    return GrasshopperCollection.extend({
        model : GrasshopperModel.extend({
            defaults : {
                resources : resources
            }
        })
    });
});
