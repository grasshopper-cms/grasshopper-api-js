/*global define:false*/
define(['text!views/contentTypeIndex/contentTypeIndexView.html', 'contentTypeIndexViewModel', 'resources', 'constants',
    'appBinders', 'contentTypeDetailRow'],
    function (template, contentTypeIndexViewModel, resources, constants, appBinders, contentTypeDetailRow) {
        'use strict';

        return {
            name : 'contentTypeIndexView',
            ModelType : contentTypeIndexViewModel,
            browserTitle : 'Content Types',
            headerTab : 'contentTypes',
            appendTo : '#stage',
            wrapper : false,
            template : template,
            listeners : [],
            events : {},
            breadcrumbs : {
                icon: 'fa-cogs',
                crumbs: [
                    {
                        text : constants.home,
                        href : constants.internalRoutes.content
                    },
                    {
                        text : resources.contentTypes,
                        href : constants.internalRoutes.contentTypes
                    }
                ]
            },
            permissions : ['admin', 'editor'],
            rivetsConfig : {
                binders : [appBinders],
                childViewBinders : {
                    'content-type-detail-row' : contentTypeDetailRow
                }
            }
        };
    });
