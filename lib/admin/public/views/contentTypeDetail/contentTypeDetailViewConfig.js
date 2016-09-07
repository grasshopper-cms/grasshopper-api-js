/*global define:false*/
define(['text!views/contentTypeDetail/contentTypeDetailView.html',
    'text!views/contentTypeDetail/_contentTypeDetailRow.html',
    'contentTypeDetailViewModel', 'appBinders', 'contentTypeDetailBinders',
    'formatters', 'resources', 'constants', 'contentTypeDetailFormatters',
    'contentTypeDetailViewFieldsCollection'],
    function (formTemplate, rowTemplate, contentTypeDetailModel, appBinders, contentTypeDetailBinders,
              formatters, resources, constants, contentTypeDetailFormatters,
              ContentTypeDetailViewFieldsCollection) {
        'use strict';

        return {
            name : 'contentTypeDetail',
            ModelType : contentTypeDetailModel,
            modelData : {},
            browserTitle : 'Content Types',
            headerTab : 'types',
            appendTo : '#stage',
            wrapper : false,
            template : formTemplate,
            breadcrumbs : {
                icon: 'fa-cog',
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
            permissions : ['admin', 'editor', 'reader'],
            rivetsConfig : {
                formatters : [formatters, contentTypeDetailFormatters],
                binders : [appBinders, contentTypeDetailBinders]
            },
            collection : new ContentTypeDetailViewFieldsCollection()
        };
    });
