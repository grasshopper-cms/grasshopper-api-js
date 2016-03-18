/*global define:false*/
define(['text!views/assetDetail/assetDetailView.html', 'assetDetailViewModel'],
    function (formTemplate, assetDetailViewModel) {
        'use strict';

        return {
            name : 'assetDetailView',
            ModelType : assetDetailViewModel,
            appendTo : '#stage',
            wrapper : false,
            template : formTemplate
        };
    });
