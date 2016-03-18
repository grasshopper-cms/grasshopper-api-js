/*global define:false*/
define(['text!validation/views/datetime/template.html', 'validationDatetimeFormatters'],
    function (template, validationDatetimeFormatters) {
    'use strict';

    return {
        name : 'datetime',
        modelData : {
            type : 'datetime',
            options : {}
        },
        template : template,
        events : {},
        wrapper: false,
        listeners : [],
        rivetsConfig : {
            formatters : [validationDatetimeFormatters]
        }
    };
});
