/*global define:false*/
define(['text!validation/views/date/template.html', 'validationDateFormatters'],
    function (template, validationDateFormatters) {
    'use strict';

    return {
        name : 'date',
        modelData : {
            type : 'date',
            options : {}
        },
        template : template,
        events : {},
        wrapper: false,
        listeners : [],
        rivetsConfig : {
            formatters : [validationDateFormatters]
        }
    };
});
