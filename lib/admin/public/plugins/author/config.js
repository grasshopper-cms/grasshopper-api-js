/*global define:false*/
define(['text!plugins/author/template.html', 'plugins/author/model', 'text!plugins/author/setupTemplate.html'],
    function (template, authorPluginModel, setupTemplate) {
        'use strict';

        return {
            name : 'authorPlugin',
            ModelType : authorPluginModel,
            modelData : {
                min : 1,
                max : 1,
                options : false,
                label : '',
                type : 'author',
                dataType : 'dropdown',
                validation : [],
                value : {
                    displayname : '',
                    _id : ''
                }
            },
            wrapper: false,
            template : template,
            setupTemplate : setupTemplate
        };
    });
