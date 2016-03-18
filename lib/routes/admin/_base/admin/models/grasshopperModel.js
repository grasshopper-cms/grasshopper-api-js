define(['backbone', 'masseuse', 'resources', 'constants', 'underscore', 'helpers', 'jquery'],
    function (Backbone, masseuse, resources, constants, _, helpers, $) {

    'use strict';

    var Model = masseuse.MasseuseModel,
        LocalStorage = helpers.localStorage;

    return Model.extend({
        fetch : fetch,
        save : save,
        destroy : destroy,
        toJSON : toJSON,
        toggle : toggle
    });

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
            _.extend(fetchOptions.success, options.success); // Why are we trying to extend function? copypaste error?
            fetchOptions.error = options.error;
        }

        args[0] = fetchOptions;
        return Backbone.Model.prototype.fetch.apply(this, args);
    }

    function save (options) {
        var $deferred,
            returnedObj,
            saveOptions = _.extend({}, options, {
                headers : {
                    'Authorization' : LocalStorage.get('authToken')
                }
            });

        returnedObj = Backbone.Model.prototype.save.call(this, null, saveOptions);

        if(returnedObj) {
            return returnedObj;
        } else {
            $deferred = new $.Deferred();

            $deferred.reject();

            return $deferred.promise();
        }
    }

    function destroy (options) {
        options = options || {};
        options.headers = _.extend({}, options.headers, {
            'Authorization' : LocalStorage.get('authToken')
        });
        return Backbone.Model.prototype.destroy.call(this, options);
    }

    function toJSON() {
        return _.clone(_.omit(this.attributes, 'resources', 'contants', 'schema', 'plugins', 'href'));
    }

    function toggle(propertyName) {
        this.set(propertyName, this.get(propertyName) ? false : true);
    }
});
