/*global define:false*/
define(['text!./template.html', 'resources', 'constants'],
    function (template, resources, constants) {
        'use strict';

        return {
            name: 'helpView',
            modelData: {},
            browserTitle: resources.help,
            headerTab : 'help',
            appendTo: '#stage',
            wrapper: false,
            template: template,
            events: {},
            listeners: [],
            breadcrumbs: {
                icon: 'fa-question',
                crumbs: [
                    {
                        text: constants.home,
                        href: constants.internalRoutes.content
                    },
                    {
                        text: resources.help,
                        href: constants.internalRoutes.help
                    }
                ]
            }/*,
            permissions: ['admin']*/
        };
    });
