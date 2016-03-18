/*global define:false*/
define(['text!plugins/radio/template.html', 'plugins/radio/model', 'text!plugins/radio/setupTemplate.html'],
    function (radioPluginTemplate, radioPluginModel, setupTemplate) {
        'use strict';

        return {
            name : 'radioPlugin',
            ModelType : radioPluginModel,
            modelData : {
                min : 1,
                max : 1,
                options : false,
                label : '',
                type : 'radio',
                dataType : 'boolean',
                validation : [],
                value : false
            },
            template : radioPluginTemplate,
            setupTemplate : setupTemplate,
            wrapper: false
        };
    });
