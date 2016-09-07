define(['grasshopperModel', 'resources', 'grasshopperCollection', 'constants', 'masseuse', 'underscore',
        'itemSelectModal/contentModel', 'assetDetailViewModel', 'searchCollection'],
    function (Model, resources, grasshopperCollection, constants, masseuse, _,
              contentModel, assetDetailViewModel, searchCollection) {

        'use strict';

        var ComputedProperty = masseuse.ComputedProperty;

        return Model.extend({
            initialize : initialize,
            idAttribute : '_id',
            defaults : {
                header : 'Select Item',
                nodeId : new ComputedProperty(['_id'], function(_id) {
                    return _id; // This is here for the contentBrowse breadcrumb.
                }),
                breadcrumbs : [],
                inRoot : new ComputedProperty(['_id'], function(_id) {
                    return _id === '0' || _id === 0;
                }),
                resources : resources,
                uploading : false,
                childNodes : null,
                content : null,
                assets : null
            },
            urlRoot : constants.api.node.url
        });

        function initialize() {
            var self = this;

            Model.prototype.initialize.apply(this, arguments);

            this.set('childNodes', new (grasshopperCollection.extend({
                url : function() {
                    return constants.api.nodesChildren.url.replace(':id', self.get('_id'));
                }
            }))());

            this.set('content', new (searchCollection.extend({
                parse : function(content) {
                    var allowedTypes = self.get('allowedTypes');

                    if(_.isEmpty(allowedTypes)) { // Show everything if user does not filter by types.
                        return content;
                    }

                    return _.filter(content, function(item) {
                        return _.contains(allowedTypes, item.meta.type);
                    });
                },
                model : contentModel,
                nodeId : function() {
                    return self.get('_id');
                },
                filterKey : 'virtual.label',
                limit : 10000,
                url : function() {
                    return constants.api.nodesContent.url.replace(':id', self.get('_id'));
                }
            }))());

            this.set('assets', new (grasshopperCollection.extend({
                model : assetDetailViewModel,
                url : function() {
                    return constants.api.assets.url.replace(':id', self.get('_id'));
                }
            }))());

        }

    });
