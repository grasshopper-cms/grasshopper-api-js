define(['moment'], function (moment) {
    'use strict';

    return {
        asDate : {
            read : readAsDate,
            publish : publishAsDate
        }
    };

    function readAsDate(value) {
        if(value) {
            return moment(value).format('YYYY-MM-DDThh:mm:ss');
        }
    }

    function publishAsDate(value) {
        if(value) {
            return moment(value).toISOString();
        }
    }

});
