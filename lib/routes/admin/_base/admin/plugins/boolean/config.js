/*global define:false*/
define(['text!plugins/boolean/template.html', 'plugins/boolean/model', 'text!plugins/boolean/setupTemplate.html'],
    function (booleanPluginTemplate, booleanPluginModel, setupTemplate) {
        'use strict';

        return {
            name : 'booleanPlugin',
            ModelType : booleanPluginModel,
            modelData : function() {
                return {
                    min : 1,
                    max : 1,
                    options : false,
                    label : '',
                    type : 'boolean',
                    dataType : 'boolean',
                    validation : [],
                    value : false
                };
            },
            template : booleanPluginTemplate,
            setupTemplate : setupTemplate,
            wrapper: false
        };
    });
