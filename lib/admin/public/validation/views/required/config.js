/*global define:false*/
define(['text!validation/views/required/template.html'], function (template) {
    'use strict';

    return {
        name : 'required',
        modelData : {
            type : 'required'
        },
        template : template,
        events : {},
        wrapper: false,
        listeners : []
    };
});
