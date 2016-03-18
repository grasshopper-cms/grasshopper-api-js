/*global define:false*/
define(['text!validation/views/alpha/template.html'], function (template) {
    'use strict';

    return {
        name : 'alpha',
        modelData : {
            type : 'alpha',
            options : {}
        },
        template : template,
        events : {},
        wrapper: false,
        listeners : []
    };
});
