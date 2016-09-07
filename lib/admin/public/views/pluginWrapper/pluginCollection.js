define(['grasshopperCollection', 'underscore'], function (GrasshopperCollection, _) {
    'use strict';

    var PluginCollection = GrasshopperCollection.extend({
        initialize : initialize,
        setValuesOnParentFieldsObject : setValuesOnParentFieldsObject,
        toJSON: toJSON,
        thisField : null,
        parentView : null
    });

    PluginCollection.createFromParentView = createFromParentView;

    return PluginCollection;

    function createFromParentView(parentView, thisField) {
        return new PluginCollection([], {
            parentView : parentView,
            thisField : thisField
        });
    }

    function initialize(models, options) {
        this.parentView = options.parentView;
        this.thisField = options.thisField;


        this.on('all', function (eventName) {
            this.setValuesOnParentFieldsObject(eventName);
        });
    }

    function setValuesOnParentFieldsObject() {
        var values = this.toJSON(),
            max = this.thisField.max;

        if(max === 1) {
            values = values[0];
        }

        this.parentView.model.set('fields.' + this.thisField._id, values);
    }

    function toJSON() {
        var json = GrasshopperCollection.prototype.toJSON.apply(this);

        return _.pluck(json, 'value');
    }
});
