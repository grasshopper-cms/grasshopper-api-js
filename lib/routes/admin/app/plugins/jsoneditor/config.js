/*global define:false*/
define(['text!plugins/jsoneditor/template.html', 'plugins/jsoneditor/model'],
    function (template, jsonEditorPluginModel) {
        'use strict';

        return {
            name : 'jsonEditorPlugin',
            ModelType : jsonEditorPluginModel,
            modelData : function() {
                return {
                    min : 1,
                    max : 1,
                    theme : 'light',
                    language : 'json',
                    label : '',
                    type : 'jsoneditor',
                    dataType : 'code',
                    validation : [],
                    value : '',
                    allowMultiple : false
                };
            },
            template : template,
            wrapper: false
        };
    });
