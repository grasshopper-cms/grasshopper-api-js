/*global define:false*/
define(['text!validation/views/email/template.html'], function (template) {
    'use strict';

    return {
        name : 'email',
        modelData : {
            type : 'email'
        },
        template : template,
        events : {},
        wrapper: false,
        listeners : []
    };
});
