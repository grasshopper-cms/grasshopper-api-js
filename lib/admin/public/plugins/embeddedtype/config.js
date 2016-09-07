/*global define:false*/
define(['text!plugins/embeddedtype/template.html', 'plugins/embeddedtype/model',
        'text!plugins/embeddedtype/setupTemplate.html', 'appBinders'
    ],
    function(embeddedtypePluginTemplate, embeddedtypePluginModel,
        setupTemplate, appBinders) {
        'use strict';

        return {
            name: 'embeddedtypePlugin',
            ModelType: embeddedtypePluginModel,
            modelData: function() {
                return {
                    min: 1,
                    max: 1,
                    options: true,
                    label: '',
                    type: 'embeddedtype',
                    dataType: 'ref',
                    validation: [],
                    value: {}
                };
            },
            template: embeddedtypePluginTemplate,
            setupTemplate: setupTemplate,
            wrapper: false,
            rivetsConfig: {
                binders: [appBinders]
            },
        };
    });
