/*global define:false*/
define(['text!views/modal/modalView.html', 'modalViewModel', 'formatters', 'modalViewBinders', 'modalViewFormatters'],
    function (template, modalViewModel, appFormatters, binders, formatters) {

    'use strict';

    return {
        name : 'modalView',
        ModelType : modalViewModel,
        appendTo : '#modal',
        wrapper : false,
        template : template,
        events : {
            'change #uploadFileInput' : 'handleFileSelect'
        },
        viewOptions : ['withSearch'],
        rivetsConfig : {
            formatters : [appFormatters, formatters],
            binders : [binders],
            instaUpdate : true
        },
        transitions : 'none'
    };
});
