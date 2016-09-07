define(['helpers', 'api', 'jquery'],
    function(helpers, Api, $) {
    'use strict';

    var LocalStorage = helpers.localStorage,
        Cookies = helpers.cookies;

    return {
        doLogout : doLogout
    };

    function doLogout () {
        var $deferred = new $.Deferred();

        if (LocalStorage.get('authToken')) {
            $.when(_removeAuthToken.call(this), LocalStorage.remove('authToken'), Cookies.remove('authToken'))
                .always(
                this.user.clear.bind(this.user),
                $deferred.resolve
            );
        } else {
            $deferred.resolve();
        }

        return $deferred.promise();
    }

    function _removeAuthToken() {
        return Api.removeAuthToken();
    }
});
