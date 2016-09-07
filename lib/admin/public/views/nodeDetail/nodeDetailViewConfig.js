/*global define:false*/
define(['text!views/nodeDetail/nodeDetailView.html',
    'nodeDetailViewModel'],
    function (template, nodeDetailViewModel) {
        'use strict';

        return {
            name : 'nodeDetailView',
            ModelType : nodeDetailViewModel,
            appendTo : '#stage',
            wrapper : false,
            template : template,
            permissions : ['admin', 'reader', 'editor']
        };
    });
