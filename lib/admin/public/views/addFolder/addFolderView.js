/*global define:false*/
define(['grasshopperBaseView', 'addFolderViewConfig', 'resources'],
    function (GrasshopperBaseView, addFolderViewConfig, resources) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : addFolderViewConfig,
            afterRender : afterRender
        });

        function afterRender () {
            _getNewFolderName.call(this);
        }

        function _getNewFolderName() {
            var self = this;

            this.displayModal(
                {
                    header : resources.node.enterName,
                    type : 'input'
                })
                .done(function (modalData) {
                    _activateContentTab.call(self);
                    _appendNodeDetailRow.call(self, modalData.data);
                })
                .always(_navigateBack.bind(this));
        }

        function _appendNodeDetailRow(nodeName) {
            this.channels.views.trigger('nodeAdded', nodeName);
        }

        function _activateContentTab() {
            this.channels.views.trigger('activateTab', 'contentTab');
        }

        function _navigateBack () {
            this.app.router.removeThisRouteFromBreadcrumb();
            this.app.router.navigateBack();
            this.remove();
        }

    });
