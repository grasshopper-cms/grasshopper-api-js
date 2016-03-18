define(['jquery', 'underscore'], function ($, _) {

    'use strict';

    return {
        breadcrumb : breadcrumb
    };

    function breadcrumb(el, breadcrumbs) {
        var $el = $(el);

        $el.empty();

        $el.append('<i class="fa '+ breadcrumbs.icon +'"></i>');

        _.each(_.initial(breadcrumbs.crumbs), function(crumb) {
            $el.append('<a href='+ crumb.href +'>'+ crumb.text +' / </a>');
        });

        $el.append('<span>'+ (_.last(breadcrumbs.crumbs)).text +'</span>');
    }
});
