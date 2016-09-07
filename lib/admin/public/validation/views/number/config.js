/*global define:false*/
define(['text!validation/views/number/template.html'], function (template) {
    'use strict';

    return {
        name : 'number',
        modelData : {
            type : 'number',
            options : {}
        },
        template : template,
        events : {},
        wrapper: false,
        listeners : []
    };
});
