/*global define:false*/
define(['text!views/pluginWrapper/pluginWrapperView.html', 'pluginWrapperViewModel',
    'appBinders', 'pluginWrapperBinders', 'formatters'],
    function (pluginWrapperTemplate, pluginWrapperViewModel,
              appBinders, pluginWrapperBinders, formatters) {
        'use strict';

        return {
            name : 'pluginWrapperView',
            ModelType : pluginWrapperViewModel,
            appendTo : '#stage',
            wrapper : false,
            template : pluginWrapperTemplate,
            permissions : ['admin', 'editor'],
            rivetsConfig : {
                formatters : [formatters],
                binders : [appBinders, pluginWrapperBinders]
            }
        };
    });
