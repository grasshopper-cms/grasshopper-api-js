/*global define:false*/
define(['text!validation/views/regex/template.html'], function (template) {
    'use strict';

    return {
        name : 'regex',
        modelData : {
            type : 'regex',
            options : {
                match : ''
            }
        },
        template : template,
        events : {},
        wrapper: false,
        listeners : []
    };
});
