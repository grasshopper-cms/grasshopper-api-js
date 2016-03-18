/*global define:false*/
define(['text!views/contentDetail/contentDetailRow/template.html', 'contentDetailViewModel'],
    function (template, contentDetailModel) {
        'use strict';

        return {
            name : 'contentDetailRow',
            ModelType : contentDetailModel,
            wrapper : false,
            template : template,
            permissions : ['admin', 'reader', 'editor']
        };
    });
