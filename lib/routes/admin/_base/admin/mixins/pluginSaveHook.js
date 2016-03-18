/*global define:false*/
define(['underscore', 'jquery'], function(_, $) {
    'use strict';

    return {
        activeSubscribers : [],
        register : register,
        remove : remove,
        save : save
    };

    function register(view) {
        this.activeSubscribers.push(view);
    }

    function remove(view) {
        this.activeSubscribers = _.reject(this.activeSubscribers, function(subscriber) {
            return subscriber.cid === view.cid;
        });
    }

    function save(fields) {
        return $.when(this.activeSubscribers
            .filter(function(subscriber) {
                return subscriber.beforeSave;
            })
            .map(function(subscriber) {
                var $deferred;

                if(subscriber.beforeSave.length > 1) {
                    $deferred = new $.Deferred();

                    subscriber.beforeSave.call(subscriber, fields, $deferred);

                    return $deferred.promise();
                } else {
                    return subscriber.beforeSave(fields);
                }
            }));
    }
});
