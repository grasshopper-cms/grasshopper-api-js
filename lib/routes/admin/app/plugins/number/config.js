/*global define:false*/
define(['text!plugins/number/template.html', 'plugins/number/model', 'text!plugins/number/setupTemplate.html'],
    function (numberPluginTemplate, numberPluginModel, setupTemplate) {
        'use strict';

        return {
            name : 'numberPlugin',
            ModelType : numberPluginModel,
            modelData : {
                min : 1,
                max : 1,
                options : false,
                label : '',
                type : 'number',
                dataType : 'object',
                validation : [],
                value : ''
            },
            template : numberPluginTemplate,
            setupTemplate : setupTemplate,
            wrapper: false
        };
    });
