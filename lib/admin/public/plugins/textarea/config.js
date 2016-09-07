/*global define:false*/
define(['text!plugins/textarea/template.html', 'plugins/textarea/model', 'text!plugins/textarea/setupTemplate.html'],
    function (textareaPluginTemplate, textareaPluginModel, setupTemplate) {
        'use strict';

        return {
            name : 'textareaPlugin',
            ModelType : textareaPluginModel,
            modelData : {
                min : 1,
                max : 1,
                options : false,
                label : '',
                type : 'textarea',
                defaultValueType : 'textarea',
                dataType : 'string',
                validation : [],
                value : ''
            },
            wrapper: false,
            template : textareaPluginTemplate,
            setupTemplate : setupTemplate
        };
    });
