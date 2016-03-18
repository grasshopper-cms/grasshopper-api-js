define([
    'backbone', 'resources', 'constants',
    'underscore', 'helpers'
], function (Backbone, resources, constants, _, helpers) {

    'use strict';

    var BaseCollection = Backbone.Collection,
        oldSet = Backbone.Collection.prototype.set,
        LocalStorage = helpers.localStorage;

    return BaseCollection.extend({
        initialize : initialize,
        fetch : fetch,
        save : save,
        destroy : destroy
    });

    function initialize() {
        BaseCollection.prototype.set = function (data, options) {
            if (data && data.results) {
                data = data.results;
            }
            oldSet.call(this, data, options);
        };
    }

    function fetch (options) {
        var token = LocalStorage.get('authToken'),
            args = Array.prototype.slice.call(arguments, 0),
            fetchOptions = {
                data : {},
                headers : {
                    'Authorization' : token
                },
                success : function () {

                }
            };

        if (options) {
            _.extend(fetchOptions.data, options.data);
            _.extend(fetchOptions.headers, options.headers);
            _.extend(fetchOptions.success, options.success);
        }

        args[0] = fetchOptions;
        return Backbone.Collection.prototype.fetch.apply(this, args);
    }

    function save () {
        var saveOptions = {headers : {
            'Authorization' : LocalStorage.get('authToken')
        }};
        return Backbone.Collection.prototype.save.call(this, null, saveOptions);
    }

    function destroy (options) {
        options = options || {};
        options.headers = _.extend({}, options.headers, {
            'Authorization' : LocalStorage.get('authToken')
        });
        return Backbone.Collection.prototype.destroy.call(this, options);
    }

});
