define(['grasshopperModel', 'resources', 'constants'], function(Model, resources, constants) {
    'use strict';

    return Model.extend({
        idAttribute: 'options',
        defaults: function() {
            return {
                resources : resources,
                accordionLabel : '',
                fields : {},
                value : {},
                availableContentTypes : null,
                activeContentType : null,
                invalidContentType : null,
                validations: {
                    setup: setupValidation,
                    content: contentValidation
                }
            };
        },
        urlRoot: constants.api.contentTypes.url
    });

    function setupValidation() {
        if (typeof this.get('options') != 'string') {
            return resources.plugins.embeddedType.validation.setup.nooptions;
        }
    }

    function contentValidation() {
        // Method is here just as an example.
        return false;
    }

});
