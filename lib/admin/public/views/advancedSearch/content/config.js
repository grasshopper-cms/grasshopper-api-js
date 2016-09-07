/*global define:false*/
define(['text!views/advancedSearch/content/template.html', 'resources', 'advancedSearch/content/model', 'constants', 'appBinders', 'contentDetailRowView'],
    function (template, resources, model, constants, appBinders, ContentDetailRowView) {

        'use strict';

        return {
            name : 'contentSearchView',
            ModelType : model,
            browserTitle : 'Content Search',
            wrapper : false,
            template : template,
            listeners : [
                ['model', 'updateUrl', 'updateUrl'],
                ['model', 'failedQuery', 'fireFailedQueryAlert']
            ],
            events : {},
            breadcrumbs : {
                icon: 'fa-search',
                crumbs: [
                    {
                        text : resources.advancedSearch,
                        href : constants.internalRoutes.advancedSearch
                    },
                    {
                        text : 'content',
                        href : constants.internalRoutes.advancedSearch + '/content'
                    }
                ]
            },
            permissions : ['admin', 'reader', 'editor'],
            rivetsConfig : {
                childViewBinders : {
                    'content-detail-row': ContentDetailRowView
                },
                binders : [appBinders]
            }
        };
    });
