define(['underscore'], function (_) {
    'use strict';

    return cleanCollection;

    function cleanCollection(collection){
        _.each(collection, function(value, key) {
            if( ( _.isObject(value) || _.isArray(value) ) && !_.isEmpty(value)) {
                cleanCollection(value);
            }

            if(_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                ( _.isEmpty(value) && !_.isString(value) && !_.isArray(value)) && !_.isBoolean(value) && !_.isNumber(value) ) {

                if(_.isArray(collection)) {
                    collection.splice(key , 1);
                } else {
                    delete collection[key];
                }

            }
        });

        return collection;
    }
});
