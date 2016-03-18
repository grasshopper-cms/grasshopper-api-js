/*global define:false*/
define(['text!validation/views/alphaNumeric/template.html'], function (template) {
    'use strict';

    return {
        name : 'alphaNumeric',
        modelData : {
            type : 'alphaNumeric',
            options : {}
        },
        template : template,
        events : {},
        wrapper: false,
        listeners : []
    };
});
