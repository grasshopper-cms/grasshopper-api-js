/*global define:false*/
define(['text!plugins/readonly/template.html', 'plugins/readonly/model', 'text!plugins/readonly/setupTemplate.html'],
    function (readonlyPluginTemplate, readonlyPluginModel, setupTemplate) {
        'use strict';

        return {
            name : 'readonlyPlugin',
            ModelType : readonlyPluginModel,
            modelData : {
                min : 1,
                max : 1,
                options : false,
                label : '',
                type : 'readonly',
                defaultValueType : 'text',
                dataType : 'string',
                validation : [],
                value : ''
            },
            wrapper: false,
            template : readonlyPluginTemplate,
            setupTemplate : setupTemplate
        };
    });
