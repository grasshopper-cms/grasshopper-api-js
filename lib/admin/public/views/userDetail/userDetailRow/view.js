define(['userDetail/view', 'userDetailRow/options'], function(UserDetailView, options) {
    'use strict';

    return UserDetailView.extend({
        defaultOptions : options,
        beforeRender : noop,
        afterRender : noop
    });

    function noop() {}

});
