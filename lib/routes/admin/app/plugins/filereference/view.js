/*global define:false*/
define(['pluginBaseView', 'underscore', 'jquery',
    'mixins/itemSelectModal', 'mixins/buildNodeRadioList'],
    function (PluginBaseView, _, $,
              itemSelectModal, buildNodeRadioList) {

        'use strict';

        return PluginBaseView.extend({
            afterRender: afterRender,
            fireSelectFileModal: fireSelectFileModal,
            selectDefaultNode: selectDefaultNode,
            fireFileDetailModal: fireFileDetailModal
        })
            .extend(itemSelectModal)
            .extend(buildNodeRadioList);

        function afterRender () {
            if (this.model.get('inSetup')) {
                this.model.get('childNodesDeep').fetch()
                    .done(
                        this.buildNodeRadioList.bind(this, this.$('#nodeRadioList'), this.model.get('childNodesDeep')),
                        _getSelectedNode.bind(this)
                    );
            }
        }

        function _getSelectedNode () {
            var defaultNode = this.model.get('options.defaultNode'),
                $defaultNodeRadio = this.$('#selectDefaultNode').find('#'+ defaultNode);

            $defaultNodeRadio.prop('checked', true);

            this.selectDefaultNode();
        }

        function selectDefaultNode() {
            var $selectedNode = this.$('#selectDefaultNode').find('input:radio[name="nodeRadio"]:checked'),
                selectedNodeId = $selectedNode.val(),
                selectedNodeLabel = $selectedNode.attr('data-label');

            this.model.set('selectedNodeLabel', selectedNodeLabel);
            this.model.set('options.defaultNode', selectedNodeId);
        }

        function fireSelectFileModal() {
            _startModalView.call(this)
                .done(_fileReferenceSelected.bind(this));
        }

        function _startModalView() {
            var value = this.model.get('value'),
                 nodeId = this.model.get('nodeId');

            return this.fireFileSelectModal(value, nodeId);
        }

        function _fileReferenceSelected(selectedFilePath) {
            this.model.set('value', selectedFilePath);
        }

        function fireFileDetailModal() {
            this.model.get('assetModel').fetch()
                .done(_fireModalWithData.bind(this));
        }

        function _fireModalWithData(data) {
            this.displayModal(
                {
                    header: this.model.get('selectedContentName'),
                    type: 'image',
                    data: data.url
                });
        }


    });
