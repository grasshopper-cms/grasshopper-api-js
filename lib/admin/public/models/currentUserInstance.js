define([], function () {

    'use strict';

    var userModelInstance = {};

    return {
        set : set,
        get : get
    };

    function set(userModel) {
        userModelInstance = userModel;
    }

    function get() {
        return userModelInstance;
    }
});
