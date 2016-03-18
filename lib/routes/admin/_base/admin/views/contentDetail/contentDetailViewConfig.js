/*global define:false*/
define(['text!views/contentDetail/contentDetailView.html',
    'contentDetailViewModel', 'appBinders', 'resources', 'constants'],
    function (formTemplate, contentDetailModel, appBinders, resources, constants) {
        'use strict';

        return {
            name : 'contentDetail',
            ModelType : contentDetailModel,
            browserTitle : 'Content',
            headerTab : 'content',
            modelData : {},
            appendTo : '#stage',
            wrapper : false,
            template : formTemplate,
            events : {},
            listeners : [],
            breadcrumbs : {
                icon: 'fa-file-o',
                crumbs: [
                    {
                        text : constants.home,
                        href : constants.internalRoutes.content
                    }
                ]
            },
            permissions : ['admin', 'reader', 'editor'],
            rivetsConfig : {
                binders : [appBinders]
            }
        };
    });
