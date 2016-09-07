/*global define:false*/
define(['grasshopperBaseView', 'addAssetsViewConfig', 'underscore', 'resources'],
    function (GrasshopperBaseView, addAssetsViewConfig, _, resources) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : addAssetsViewConfig,
            afterRender : afterRender
        });

        function afterRender () {
            _handleUpload.call(this);
        }

        function _handleUpload () {
            var self = this;
            this.displayModal(
                {
                    header : resources.asset.uploadAssetModalMsg,
                    type : 'upload',
                    data : {}
                })
                .done(function (modalData) {
                    self.channels.views.trigger('activateTab', 'filesTab');
                    _.each(modalData.files, function (file) {
                        _appendAssetDetailRow.call(self, file);
                    });
                    _navigateBack.call(self);
                })
                .fail(_navigateBack.bind(this));
        }


        function _navigateBack (trigger) {
            this.app.router.removeThisRouteFromBreadcrumb();
            this.app.router.navigateBack(trigger);
            this.remove();
        }

        function _appendAssetDetailRow (file) {
            var payload = {
                fileName : file.name,
                size : file.size,
                lastmodified : file.lastModifiedDate,
                fileData : file,
                uploadError : false,
                nodeId : this.model.get('nodeId')
            };

            this.channels.views.trigger('assetAdded', payload);
        }

    });
