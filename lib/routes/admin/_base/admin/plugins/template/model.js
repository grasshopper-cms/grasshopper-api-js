define(['grasshopperModel', 'resources'], function (Model, resources) {
    'use strict';

    return Model.extend({
        defaults : getDefaults
    });

    function getDefaults() {
        return {
            resources : resources,
            options : {
                template : 'http://www.<%= fields.title %>.com'
            }
        };
    }

});
