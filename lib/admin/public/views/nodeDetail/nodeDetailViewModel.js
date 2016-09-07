define(['grasshopperModel', 'resources', 'masseuse', 'constants'], function (Model, resources, masseuse, constants) {
    'use strict';
    var ComputedProperty = masseuse.ComputedProperty;
    return Model.extend({
        idAttribute : '_id',
        defaults : {
            constants : constants,
            resources : resources,
            href : new ComputedProperty(['_id'], function (id) {
                return constants.internalRoutes.nodeDetail.replace(':id', id);
            })
        },
        urlRoot : constants.api.node.url
    });
});
