define(['grasshopperModel', 'resources', 'constants', 'contentTypeIndexViewContentTypesCollection'],
    function (Model, resources, constants, ContentTypesCollection) {

    'use strict';

    return Model.extend({
        defaults : getDefaults,
        url : constants.api.contentTypes.url
    });

    function getDefaults() {
        return {
            resources : resources,
            contentTypes : new ContentTypesCollection(),
            currentContentsSort : 'ascending'
        };
    }

});
