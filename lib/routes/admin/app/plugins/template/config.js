/*global define:false*/
define(['text!plugins/template/template.html', 'plugins/template/model', 'text!plugins/template/setupTemplate.html'],
    function (templatePluginTemplate, templatePluginModel, setupTemplate) {
        'use strict';

        return {
            name : 'templatePlugin',
            ModelType : templatePluginModel,
            modelData : {
                min : 1,
                max : 1,
                options : {
                    template : ''
                },
                label : '',
                type : 'template',
                defaultValueType : 'text',
                dataType : 'reference',
                validation : [],
                value : ''
            },
            template : templatePluginTemplate,
            setupTemplate : setupTemplate,
            wrapper: false,
            listeners : [
                ['channels.views', 'contentFieldsChange', 'debouncedRefreshTemplate']
            ]
        };
    });
