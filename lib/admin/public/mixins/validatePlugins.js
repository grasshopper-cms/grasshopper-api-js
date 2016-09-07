define(['mixins/pluginSaveHook', 'underscore'], function(pluginSaveHook, _) {
    'use strict';

    return {
        validateOnContentSave: validate.bind(null, 'content'),
        validateOnContentTypeSave: validate.bind(null, 'setup')
    };

    /**
     *  Plugins can have validation on creation or when being used as content. In order to use, attach the methods to the model.
     *  validation: {
            setup: setupValidation,
            content: contentValidation
        }
     *
     */

    function validate(type) {
        return _.map(pluginSaveHook.activeSubscribers, function(subscriber) {
            if (subscriber.model.get('validations') && subscriber.model.get('validations')[type] && _(subscriber.model.get('validations')[type]).isFunction()) {
                return subscriber.model.get('validations')[type].call(subscriber.model);
            }
        });
    }

});
