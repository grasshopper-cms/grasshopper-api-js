/*global define:false*/
define(['text!views/forbidden/forbiddenView.html', 'resources', 'constants'],
    function (template, resources, constants) {
        'use strict';

        return {
            name : 'forbiddenView',
            modelData : {},
            browserTitle : 'Forbidden',
            appendTo : '#stage',
            wrapper : false,
            template : template,
            events : {},
            listeners : [],
            breadcrumbs : {
                icon: 'fa-moon-o',
                crumbs: [
                    {
                        text : constants.home,
                        href : constants.internalRoutes.content
                    },
                    {
                        text : resources.forbidden,
                        href : constants.internalRoutes.forbidden
                    }
                ]
            }
        };
    });
