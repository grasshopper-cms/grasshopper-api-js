/*global define:false*/
define(['text!views/masthead/mastheadView.html', 'mastheadViewModel', 'resources', 'mastheadViewBinders', 'constants'],
    function (template, mastheadViewModel, resources, mastheadViewBinders, constants) {
        'use strict';

        return {
            name : 'mastheadView',
            modelData : {},
            ModelType : mastheadViewModel,
            appendTo : '#masthead',
            wrapper : false,
            template : template,
            listeners : [
                ['channels.views', 'updateMastheadButtons', 'setButtons'],
                ['channels.views', 'updateMastheadBreadcrumbs', 'setBreadcrumbs']
            ],
            defaultBreadcrumbs : {
                icon: 'fa-search',
                crumbs: [
                    {
                        text : constants.home,
                        href : '#'
                    }
                ]
            },
            defaultMastheadButtons : [
                {
                    text : resources.mastheadButtons.createFolder,
                    href : '#'
                }
            ],
            rivetsConfig : {
                binders : [mastheadViewBinders]
            }
        };
    });
