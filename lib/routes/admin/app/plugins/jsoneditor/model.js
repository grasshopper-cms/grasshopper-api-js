define(['grasshopperModel', 'resources'], function (Model, resources) {

    'use strict';

    return Model.extend({
        defaults : function() {
            return {
                resources : resources,
                loading : false
            };
        }
    });

});
