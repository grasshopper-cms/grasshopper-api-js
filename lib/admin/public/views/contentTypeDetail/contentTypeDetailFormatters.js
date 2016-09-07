define(['underscore'], function (_) {
    'use strict';

    /**
     * @namespace formatters
     */
    return {
        collectionHasLength : collectionHasLength,
        booleanToYesNo : booleanToYesNo,
        radioToBoolean : {
            read : readRadioToBoolean,
            publish : publishRadioToBoolean
        },
        hasAllowMultiple : hasAllowMultiple
    };

    /**
     * @memberof formatters
     * @instance
     * @param value
     * @returns {string}
     */

    function collectionHasLength(collection) {
        return (collection.length);
    }

    function booleanToYesNo(value) {
        return (value) ? 'Yes' : 'No';
    }

    function readRadioToBoolean(value) {
        if(value) {
            return 'on';
        }
        return 'off';
    }

    function publishRadioToBoolean(value) {
        if(value === 'on') {
            return true;
        }
        return false;
    }

    function hasAllowMultiple (value) {
        return (_.isUndefined(value) ? true : value);
    }
});
