/*global define:false*/
define(['text!validation/views/url/template.html'], function (template) {
    'use strict';

    return {
        name : 'url',
        modelData : {
            type : 'url',
            options : {}
        },
        template : template,
        events : {},
        wrapper: false,
        listeners : []
    };
});
