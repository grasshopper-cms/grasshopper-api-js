/*global define:false*/
define(['text!views/itemSelectModal/contentTemplate.html', 'text!views/itemSelectModal/fileTemplate.html',
    'itemSelectModal/model',
    'appBinders', 'resources', 'itemSelectModal/binders'],
    function (contentTemplate, fileTemplate, Model, appBinders, resources, binders) {
    'use strict';

    return {
        name : 'itemSelectModal',
        ModelType : Model,
        appendTo : '#modal',
        wrapper : false,
        contentTemplate : contentTemplate,
        fileTemplate : fileTemplate,
        rivetsConfig : {
            instaUpdate : true,
            binders : [appBinders, binders]
        },
        privateBreadcrumbs : true,
        breadcrumbs : [
            {
                text : resources.root,
                nodeId : '0'
            }
        ],
        events : {
            'click #confirm' : 'confirmModal',
            'click #cancel' : 'cancelModal',
            'click .modalBreadcrumb' : 'navigateToFolder'
        },
        transitions : 'none'
    };
});
