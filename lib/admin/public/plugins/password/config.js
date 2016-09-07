/*global define:false*/
define(['text!plugins/password/template.html', 'plugins/password/model', 'text!plugins/password/setupTemplate.html'],
    function (passwordPluginTemplate, passwordPluginModel, setupTemplate) {
        'use strict';

        return {
            name : 'passwordPlugin',
            ModelType : passwordPluginModel,
            modelData : {
                min : 1,
                max : 1,
                options : false,
                label : '',
                type : 'password',
                defaultValueType : 'text',
                dataType : 'string',
                validation : [],
                value : ''
            },
            template : passwordPluginTemplate,
            setupTemplate : setupTemplate,
            wrapper: false
        };
    });
