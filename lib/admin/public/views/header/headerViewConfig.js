/*global define:false*/
define(['text!views/header/headerView.html', 'headerViewModel', 'formatters', 'appBinders'],
    function (template, HeaderViewModel, formatters, appBinders) {
        'use strict';

        return {
            name : 'headerView',
            modelData : {},
            ModelType : HeaderViewModel,
            appendTo : '#header',
            wrapper : false,
            template : template,
            events : {},
            listeners : [
                ['channels.views', 'checkHeaderTab', 'checkHeaderTab']
            ],
            rivetsConfig: {
                formatters : [formatters],
                binders : [appBinders]
            }
        };
    });
