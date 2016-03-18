define(['momentTimezoneWithData','resources', 'constants'], function (moment, resources, constants) {
    'use strict';

    return {
        asEditorialDate : {
            read : readAsEditorialDate,
            publish : publishAsEditorialDate
        }
    };

    function readAsEditorialDate(value) {
        if (value) {
            return _adjustReadIfTimeZone().format(resources.plugins.editorialWindow.dateFormat);
        }

        function _adjustReadIfTimeZone() {
            if (constants.timeZone) {
                return moment.tz(value, constants.timeZone);
            } else {
                return moment(value);
            }
        }
    }

    function publishAsEditorialDate(value) {
        if (value) {
            // ISO String used, as well as in the view when setting dates on the model, to allow moment to interpret them consistently
            return _adjustPublishIfTimeZone().toISOString();
        }

        function _adjustPublishIfTimeZone() {
            if (constants.timeZone) {
                return moment.tz(value, resources.plugins.editorialWindow.dateFormat, constants.timeZone);
            } else {
                return moment(value);
            }
        }
    }

});
