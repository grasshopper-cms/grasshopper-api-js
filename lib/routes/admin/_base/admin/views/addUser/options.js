/*global define:false*/
define(['text!views/addUser/template.html', 'addUser/model', 'resources', 'constants', 'appBinders'],
    function (template, Model, resources, constants, appBinders) {
    'use strict';

    return {
        name : 'addUser',
        ModelType : Model,
        browserTitle : 'Add New User',
        headerTab : 'users',
        modelData : {},
        appendTo : '#stage',
        wrapper : false,
        template : template,
        events : {},
        listeners : [],
        mastheadButtons : [],
        breadcrumbs : {
            icon: 'fa-puzzle-piece',
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
        permissions : ['admin'],
        rivetsConfig : {
            binders : [appBinders]
        }
    };
});
