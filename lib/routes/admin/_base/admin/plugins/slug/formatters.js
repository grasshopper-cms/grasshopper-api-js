/*global define:false*/
define([], function () {
    'use strict';

    return {
        asSlug: {
            read: readAsSlug,
            publish: publishAsSlug
        }
    };

    function readAsSlug(value) {
        if (value) {
            return value.toLowerCase().trim().replace(/[\s]+/g, '-').replace(/[^-a-zA-Z0-9._~]/g, '');
        }
        else {
            return '';
        }
    }

    function publishAsSlug(value) {
        if (value) {
            return value.toLowerCase().trim().replace(/[\s]+/g, '-').replace(/[^-a-zA-Z0-9._~]/g, '');
        } else {
            return '';
        }
    }
});
