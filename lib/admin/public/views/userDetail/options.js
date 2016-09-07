/*global define:false*/
define(['text!views/userDetail/template.html', 'userDetail/model',
    'resources', 'constants', 'appBinders'],
    function (template, model, resources, constants, appBinders) {
        'use strict';

        return {
            name : 'userDetail',
            modelData : {},
            ModelType : model,
            browserTitle : 'User Details',
            headerTab : 'users',
            appendTo : '#stage',
            wrapper : false,
            template : template,
            breadcrumbs : {
                icon: 'fa-user',
                crumbs: [
                    {
                        text : constants.home,
                        href : constants.internalRoutes.content
                    },
                    {
                        text : resources.users,
                        href : constants.internalRoutes.users
                    }
                ]
            },
            rivetsConfig : {
                binders : [appBinders]
            }
        };
    });
