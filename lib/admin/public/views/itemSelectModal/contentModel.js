define(['grasshopperModel', 'masseuse'], function (Model, masseuse) {
    'use strict';

    var ComputedProperty = masseuse.ComputedProperty;

    return Model.extend({
        defaults : {
            label : new ComputedProperty(['fields'], function() {
                if(this.get('meta.labelfield')) {
                    return this.get('fields.'+ [this.get('meta.labelfield')]);
                }
            })
        }
    });

});
