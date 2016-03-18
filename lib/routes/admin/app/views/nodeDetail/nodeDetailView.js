/*global define:false*/
define(['grasshopperBaseView', 'nodeDetailViewConfig', 'nodeWorker', 'mixins/handleRowClick'],
    function (GrasshopperBaseView, nodeDetailViewConfig, nodeWorker, handleRowClick) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : nodeDetailViewConfig,
            afterRender : afterRender,
            prepareToDeleteNode : prepareToDeleteNode,
            prepareToEditContentTypes : prepareToEditContentTypes,
            editNodeName : editNodeName,
            editContentTypes : editContentTypes
        })
            .extend(handleRowClick);

        function afterRender() {
            if(this.model.isNew()) {
                this.model.save()
                    .done(this.editContentTypes.bind(this));
            }
        }

        function prepareToDeleteNode () {
            nodeWorker.deleteNode.call(this);
        }

        function editNodeName() {
            nodeWorker.editName.call(this);
        }

        function prepareToEditContentTypes() {
            this.editContentTypes();
        }

        function editContentTypes() {
            nodeWorker.editContentTypes.call(this);
        }

    });
