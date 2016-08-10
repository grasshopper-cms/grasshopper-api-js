'use strict';

module.exports = function populateNecessaryAdminData(request, response, next) {
    response.locals.menuItems = [
            {
                'showWhenUserRoleIncludes' : 'admin reader editor',
                'name' : 'Content',
                'href' : '/admin/items',
                'iconClasses' : 'fa fa-th'
            },
            {
                'showWhenUserRoleIncludes' : 'admin',
                'name' : 'Types',
                'href' : '/admin/content-types',
                'iconClasses' : 'fa fa-cogs'
            },
            {
                'showWhenUserRoleIncludes' : 'admin',
                'name' : 'Users',
                'href' : '/admin/users',
                'iconClasses' : 'fa fa-user'
            },
            {
                'showWhenUserRoleIncludes' : 'admin reader editor',
                'name' : 'Advanced Search',
                'href' : '/admin/advanced-search',
                'iconClasses' : 'fa fa-search'
            },
            {
                'showWhenUserRoleIncludes' : 'admin reader editor',
                'name' : 'Settings',
                'href' : '/admin/settings',
                'iconClasses' : 'fa fa-cogs'
            },
            {
                'showWhenUserRoleIncludes' : 'admin reader editor',
                'isSpacer' : 'true'
            },
            {
                'showWhenUserRoleIncludes' : 'admin reader editor',
                'name' : 'Help',
                'href' : '/admin/help',
                'iconClasses' : 'fa fa-question'
            }
        ];

    next();
};