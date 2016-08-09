'use strict';

module.exports = function populateNecessaryAdminData(request, response, next) {
    response.locals.menuItems = [
            {
                'showWhenUserRoleIncludes' : 'admin reader editor',
                'name' : 'Content',
                'href' : '/items',
                'iconClasses' : 'fa fa-th'
            },
            {
                'showWhenUserRoleIncludes' : 'admin',
                'name' : 'Types',
                'href' : '/content-types',
                'iconClasses' : 'fa fa-cogs'
            },
            {
                'showWhenUserRoleIncludes' : 'admin',
                'name' : 'Users',
                'href' : '/users',
                'iconClasses' : 'fa fa-user'
            },
            {
                'showWhenUserRoleIncludes' : 'admin reader editor',
                'name' : 'Advanced Search',
                'href' : '/advanced-search',
                'iconClasses' : 'fa fa-search'
            },
            {
                'showWhenUserRoleIncludes' : 'admin reader editor',
                'name' : 'Info',
                'href' : '/info',
                'iconClasses' : 'fa fa-info'
            },
            {
                'showWhenUserRoleIncludes' : 'admin reader editor',
                'isSpacer' : 'true'
            },
            {
                'showWhenUserRoleIncludes' : 'admin reader editor',
                'name' : 'Help',
                'href' : '/help',
                'iconClasses' : 'fa fa-question'
            }
        ];

    next();
};