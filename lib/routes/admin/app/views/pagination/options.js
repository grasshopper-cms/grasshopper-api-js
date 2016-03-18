/*global define:false*/
define(['text!views/pagination/template.html', 'pagination/model'], function (template, model) {
    'use strict';

    return {
        name : 'paginationView',
        modelData : {},
        ModelType : model,
        wrapper : false,
        template : template,
        events : {},
        listeners : []
    };
});
