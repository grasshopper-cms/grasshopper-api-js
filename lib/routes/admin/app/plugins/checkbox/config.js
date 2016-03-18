/*global define:false*/
define(['text!plugins/checkbox/template.html', 'plugins/checkbox/model', 'text!plugins/checkbox/setupTemplate.html'],
    function (checkboxPluginTemplate, checkboxPluginModel, setupTemplate) {

        'use strict';

        return {
            name : 'checkboxPlugin',
            ModelType : checkboxPluginModel,
            modelData : function() {
                return {
                    min : 1,
                    max : 1,
                    options : true,
                    label : '',
                    type : 'checkbox',
                    dataType : 'boolean',
                    validation : []
                };
            },
            template : checkboxPluginTemplate,
            setupTemplate : setupTemplate,
            events : {
                'click #addOption' : 'addOption',
                'blur .optionInput' : 'reduceOptions',
                'click .checkboxListCheckbox' : 'reduceValues'
            },
            wrapper: false
        };
    });
