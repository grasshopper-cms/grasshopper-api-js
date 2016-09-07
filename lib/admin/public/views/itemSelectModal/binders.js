define(['jquery', 'underscore'], function ($, _) {

    'use strict';

    return {
        breadcrumb : breadcrumb
    };

    function breadcrumb(el, breadcrumbs) {
        var $el = $(el);

        $el.empty();

        if(breadcrumbs && breadcrumbs.length > 1) {
            _.each(_.initial(breadcrumbs), function(crumb) {
                $el.append('<a class="modalBreadcrumb" nodeId="'+ crumb.nodeId +'">'+ crumb.text +' / </a>');
            });

            $el.append('<span>'+ _.last(breadcrumbs).text +'</span>');
        } else if (breadcrumbs && !_.isEmpty(breadcrumbs)) {
            $el.append('<span>'+ _.last(breadcrumbs).text +'</span>');
        }
    }
});
