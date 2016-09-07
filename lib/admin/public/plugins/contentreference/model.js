define(['grasshopperModel', 'resources', 'backbone', 'constants', 'grasshopperCollection', 'masseuse'],
    function (Model, resources, Backbone, constants, grasshopperCollection, masseuse) {

    'use strict';

    var ComputedProperty = masseuse.ComputedProperty;

    return Model.extend({
        initialize : initialize,
        defaults : {
            resources : resources,
            selectedContentHref : new ComputedProperty(['value'], function(contentId) {
                return constants.internalRoutes.contentDetail.replace(':id', contentId);
            }),
            selectedContentLabel : new ComputedProperty(['contentDetails'], function() {
                return this.get('contentDetails.fields.' + this.get('contentDetails.meta.labelfield'));
            }),
            _id : '0',
            nodeId : new ComputedProperty(['options'], function() {
                return this.get('options.defaultNode');
            }),
            inSetup : false,
            loading : false,
            childNodesDeep : null,
            contentDetails : null,
            availableTypes : null,
            allowedTypes : null
        },
        urlRoot : constants.api.node.url
    });

    function initialize() {
        var self = this;

        Model.prototype.initialize.apply(this, arguments);

        this.set('childNodesDeep', new (grasshopperCollection.extend({
            comparator : 'ancestors', // to ensure the nodes with ancestors are always at the end
            url : function() {
                return constants.api.nodesChildrenDeep.url.replace(':id', self.get('_id'));
            }
        }))());

    }

});
