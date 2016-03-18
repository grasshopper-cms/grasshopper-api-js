/*global define:false*/
define(['text!views/contentBrowse/contentBrowseView.html', 'resources', 'contentBrowseViewModel', 'constants',
        'appBinders', 'nodeDetailView', 'contentDetailRowView', 'assetDetailView', 'pagination/view', 'formatters'],
    function (template, resources, contentBrowseViewModel, constants,
              appBinders, NodeDetailView, ContentDetailRowView, AssetDetailView, PaginationView, formatters) {

        'use strict';

        return {
            name : 'contentBrowseView',
            ModelType : contentBrowseViewModel,
            browserTitle : 'Content',
            headerTab : 'content',
            appendTo : '#stage',
            wrapper : false,
            template : template,
            listeners : [
                ['channels.views', 'activateTab', 'activateTab'],
                ['channels.views', 'nodeAdded', 'addNewNode'],
                ['channels.views', 'assetAdded', 'addNewAsset']
            ],
            events : {},
            breadcrumbs : {
                icon : 'fa-th',
                crumbs : [
                    {
                        text : constants.home,
                        href : constants.internalRoutes.content
                    }
                ]
            },
            permissions : ['admin', 'reader', 'editor'],
            rivetsConfig : {
                instaUpdate: true,
                binders : [appBinders],
                formatters : [formatters],
                childViewBinders : {
                    'node-detail-row': NodeDetailView,
                    'content-detail-row': ContentDetailRowView,
                    'asset-detail-row' : AssetDetailView,
                    'pagination-view' : PaginationView
                }
            },
            transitions : {
                enter : {
                    type : 'fadeIn',
                    options : {
                        duration : 100
                    }
                }
            },
            hotkeys : [
                {
                    keys : 'c',
                    method : 'createContent'
                }
            ]
        };
    });
