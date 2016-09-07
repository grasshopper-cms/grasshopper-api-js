/*global define:false*/
define(['text!views/info/infoView.html', 'resources', 'constants'],
    function (template, resources, constants) {
        'use strict';

        return {
            name: 'infoView',
            modelData: {},
            browserTitle: resources.info,
            headerTab : 'info',
            appendTo: '#stage',
            wrapper: false,
            template: template,
            events: {},
            listeners: [],
            breadcrumbs: {
                icon: 'fa-info',
                crumbs: [
                    {
                        text: constants.home,
                        href: constants.internalRoutes.content
                    },
                    {
                        text: resources.info,
                        href: constants.internalRoutes.info
                    }
                ]
            }/*,
            permissions: ['admin']*/
        };
    });
