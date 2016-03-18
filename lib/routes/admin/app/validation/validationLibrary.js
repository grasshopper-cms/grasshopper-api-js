define(function () {
    'use strict';
    return {
        stringHasLength : function (string) {
            return !!(string && string.constructor === String);
        }
    };
});
