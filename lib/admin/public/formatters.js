define(['sparkmd5', 'constants'], function (sparkmd5, constants) {
    'use strict';

    /**
     * @namespace formatters
     */
    return {
        prepend: prepend,
        isGreaterThan: isGreaterThan,
        asNumber: {
            read: readAsNumber,
            publish: publishAsNumber
        },
        hasLength: hasLength,
        sort: sort,
        sortBy: sortBy,
        gravatarUrl: gravatarUrl,
        preventDefault : preventDefault,
        stopImmediatePropagation : stopImmediatePropagation,
        asBoolean : asBoolean,
        asUserDetailsLink: asUserDetailsLink,
        equals : equals,
        toCamelCase : toCamelCase
    };

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */

    function prepend(value, string) {
        return string + value;
    }

    function isGreaterThan(value, compareTo) {
        return value > compareTo;
    }

    function readAsNumber(value) {
        return value;
    }

    function publishAsNumber(value) {
        return parseInt(value, 10);
    }

    function hasLength(value) {
        return (value && value.length > 0);
    }

    function sort(arr, direction) {
        if (direction === 'desc') {
            return arr.sort().reverse();
        }
        return arr.sort();
    }

    function sortBy(arr, field, direction) {
        var reverse = (direction === 'desc'),
            out,
            sortFn = function (a, b) {
                if (a[field] < b[field]) {
                    out = -1;
                } else if (a[field] > b[field]) {
                    out = 1;
                } else {
                    out = 0;
                }

                return out * [1, -1][+!!reverse];
            };

        return arr.sort(sortFn);

    }

    function gravatarUrl(email, args) {
        var md5value = email ? sparkmd5.hash(email.toLowerCase()) : '';
        return 'http://www.gravatar.com/avatar/' + md5value + '?s=' + args + '&d=mm';
    }

    function stopImmediatePropagation(value) {
        return function(e) {
            e.stopImmediatePropagation();
            value.call(this, e);
            return false;
        };
    }

    function preventDefault(value) {
        return function(e) {
            e.preventDefault();
            value.call(this, e);
            return false;
        };
    }

    function asBoolean(value) {
        return (value === 'true' || value === true);
    }

    function asUserDetailsLink(value){
        return constants.internalRoutes.userDetail.replace(':id', value);
    }

    function equals(value, comparator) {
        return value == comparator;
    }

    function toCamelCase(str) {
        // Stole this from: http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }
});
