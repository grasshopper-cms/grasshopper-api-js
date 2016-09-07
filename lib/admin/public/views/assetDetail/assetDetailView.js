/*global define:false*/
define(['grasshopperBaseView', 'assetDetailViewConfig', 'resources', 'api', 'assetWorker'],
    function (GrasshopperBaseView, assetDetailViewConfig, resources, Api, AssetWorker) {
        'use strict';
        return GrasshopperBaseView.extend({
            defaultOptions : assetDetailViewConfig,
            afterRender : afterRender,
            handleRowClick : handleRowClick,
            prepareToDeleteAsset : prepareToDeleteAsset,
            editAsset : editAsset,
            cancelUpload : cancelUpload
        });

        function afterRender() {
            if(this.model.has('fileData')) {
                _postNewAsset.call(this);
            }
        }

        function handleRowClick(e) {
            e.stopPropagation();
            this.displayModal(
                {
                    header: this.model.get('fileName'),
                    type: 'image',
                    data: this.model.get('url')
                });
        }

        function prepareToDeleteAsset(e) {
            e.stopPropagation();
            this.displayModal(
                {
                    header : resources.warning,
                    msg: resources.asset.deletionWarning
                })
                .done(_deleteAsset.bind(this));
        }

        function editAsset(e) {
            var self = this;

            e.stopPropagation();

            _getNewFileName.call(this)
                .done(function(modalData) {
                    _postRenamedAsset.call(self, modalData.data)
                        .done(_handleSuccessfulAssetRename.bind(self, modalData.data))
                        .fail(_handleAssetRenameError.bind(this));
                });
        }

        function _postNewAsset() {
            AssetWorker.postNewAsset(this.model.get('nodeId'), this.model.get('fileData'))
                .done(_handleSuccessfulUpload.bind(this))
                .fail(_handleFailedUpload.bind(this))
                .progress(_handleUploadProgress.bind(this));
        }

        function cancelUpload() {
            this.remove();
        }

        function _deleteAsset () {
            this.model.destroy()
                .done(_handleSuccessfulDelete.bind(this))
                .fail(_handleDeletionError.bind(this));
        }

        function _handleSuccessfulDelete () {
            this.displayTemporaryAlertBox(
                {
                    header : resources.success,
                    msg: resources.asset.successfullyDeleted.replace(':asset', this.model.get('fileName')),
                    style : 'success'
                }
            );
        }

        function _handleDeletionError () {
            this.fireErrorModal(resources.asset.errorDeleted + this.model.get('fileName'));
        }

        function _getNewFileName() {
            return this.displayModal(
                {
                    msg: resources.asset.editFileName,
                    type: 'input',
                    data: this.model.get('fileName')
                });
        }

        function _postRenamedAsset(newFileName) {
            return Api.renameAsset(this.model.urlRoot(), this.model.get('fileName'), newFileName);
        }

        function _handleSuccessfulAssetRename(newFileName) {
            var self = this;

            this.model.set('fileName', newFileName);
            this.model.fetch()
                .done(function() {
                    self.displayTemporaryAlertBox(
                        {
                            header : resources.success,
                            style : 'success',
                            msg: resources.asset.editNameSuccess
                        }
                    );
                });
        }

        function _handleAssetRenameError() {
            this.fireErrorModal(resources.asset.editNameFail);
        }

        function _handleUploadProgress(percentDone) {
            this.model.set('progressWidth', percentDone);
        }

        function _handleSuccessfulUpload(response) {
            var self = this;
            this.model.fetch()
                .done(function() {
                    self.model.unset('fileData');
                });
            this.displayTemporaryAlertBox(
                {
                    header : resources.success,
                    style : 'success',
                    msg: response
                }
            );
        }

        function _handleFailedUpload() {
            this.model.set('uploadError', true);
            _handleUploadProgress.call(this, 0);
            this.fireErrorModal(resources.asset.uploadAssetError);
        }

    });
