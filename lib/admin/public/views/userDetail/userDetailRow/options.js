define(['userDetail/options', 'jquery', 'text!views/userDetail/userDetailRow/template.html'],
    function(userDetailViewOptions, $, template) {
        'use strict';

        return $.extend(true, {}, userDetailViewOptions, {
            template : template
        });
    });
