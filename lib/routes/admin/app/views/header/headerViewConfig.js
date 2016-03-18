/*global define:false*/
define(['text!views/header/headerView.html', 'headerViewModel', 'formatters'],
    function (template, HeaderViewModel, formatters) {
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
                formatters : [formatters]
            }
        };
    });
