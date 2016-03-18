define(['grasshopperModel', 'resources', 'constants', 'grasshopperCollection', 'masseuse',
    'underscore', 'assetDetailViewModel'],
    function (Model, resources, constants, grasshopperCollection, masseuse,
              _, assetDetailViewModel) {

    'use strict';

    var ComputedProperty = masseuse.ComputedProperty;

    return Model.extend({
        initialize : initialize,
        defaults : {
            resources : resources,
            inSetup : false,
            selectedFileName : new ComputedProperty(['value'], function(filePath) {
                return (filePath) ? _.last(filePath.split('/')) : '';
            }),
            assetModel : new ComputedProperty(['value'], function(value){
                if(value) {
                    return new assetDetailViewModel({
                        nodeId : _.first(value.split('/')),
                        url : value
                    });
                }
            }),
            nodeId : new ComputedProperty(['options'], function() {
                return this.get('options.defaultNode');
            }),
            value : '',
            _id : '0',
            childNodesDeep : null,
            selectedNodeLabel : null
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
