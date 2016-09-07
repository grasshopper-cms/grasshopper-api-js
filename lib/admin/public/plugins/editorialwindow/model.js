define(['grasshopperModel', 'resources', 'moment', 'constants'], function (Model, resources, moment, constants) {
    'use strict';

    return Model.extend({
        initialize : initialize,
        defaults : {
            resources : resources,
            constants : constants,
            orderError : false,
            value : {
                validFrom : '',
                validTo : ''
            }
        }
    });

    function initialize() {
        this.on('change:value', _ensureEndIsAlwaysAfterStart.bind(this));
    }

    function _ensureEndIsAlwaysAfterStart() {

        var validFrom = convert(this.get('value.validFrom')),
            validTo = convert(this.get('value.validTo'));

        if(!moment(validTo).isAfter(validFrom)) {
            this.set('orderError', true);
        } else {
            this.set('orderError', false);
        }
    }

    function convert(value) {
        if (!constants.timeZone && /Z$/i.test(value)) {
            return value;
        } else {
            return moment.tz(new Date(value), constants.timeZone).toISOString();
        }
    }

});
