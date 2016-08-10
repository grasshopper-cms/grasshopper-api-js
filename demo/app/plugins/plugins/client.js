'use strict';

var simpleCustomAttributes = require('simple-custom-attributes'),
    view = {
        plugins : window.plugins,
        handlePluginCheck : handlePluginCheck
    };

simpleCustomAttributes.addAttribute('on-change', {
    bind : function(el, value) {
        el.addEventListener('change', value);
    },
    unbind : function(el, value) {
        el.removeEventListener('change', value);
    }
});

simpleCustomAttributes.register(view, document.querySelector('#plugins'));

function handlePluginCheck() {
    window.gh.appState
        .transform('configs.menuItems')
        .with(function(menuItems, item) {
            menuItems.push(item);
            return menuItems;
        })
        .using({
            'showWhenUserRoleIncludes' : 'admin',
            'name' : 'Dawg',
            'href' : '/admin/content-types',
            'iconClasses' : 'fa fa-refresh fa-spin'
        });
}