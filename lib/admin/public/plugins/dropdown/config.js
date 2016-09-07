/*global define:false*/
define(['text!plugins/dropdown/template.html', 'plugins/dropdown/model', 'text!plugins/dropdown/setupTemplate.html'],
    function (dropdownPluginTemplate, dropdownPluginModel, setupTemplate) {
        'use strict';

        return {
            name : 'dropdownPlugin',
            ModelType : dropdownPluginModel,
            modelData : {
                min : 1,
                max : 1,
                options : true,
                label : '',
                type : 'dropdown',
                dataType : 'dropdown',
                validation : [],
                value : undefined
            },
            wrapper: false,
            template : dropdownPluginTemplate,
            setupTemplate : setupTemplate,
            events : {
                'click #addOptionToDropdown' : 'addOptionToDropdown',
                'blur .optionInput' : 'reduceCollection'
            },
            collection : null
        };
    });
