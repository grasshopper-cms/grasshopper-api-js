/*global define:false*/
define(['grasshopperBaseView', 'addContentViewConfig', 'resources', 'contentTypeWorker'],
    function (GrasshopperBaseView, addContentViewConfig, resources, contentTypeWorker) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : addContentViewConfig,
            beforeRender : beforeRender
        });

        function beforeRender ($deferred) {
            _handleCreateContent.call(this, $deferred);
        }

        function _handleCreateContent ($deferred) {
            _getNodesContentTypes.call(this, this.model.get('meta.node'))
                .done(_decideHowToHandleContentTypeSelection.bind(this, $deferred))
                .fail(_handleFailedContentTypeRetrieval.bind(this, $deferred));
        }

        function _getNodesContentTypes(nodeId) {
            return contentTypeWorker.getNodesContentTypes(nodeId);
        }

        function _decideHowToHandleContentTypeSelection($deferred, nodeData) {
            var self = this,
                allowedTypes = nodeData.allowedTypes;

            if(allowedTypes) {
                switch (allowedTypes.length) {
                case (0) :
                    _handleNodeWithZeroContentTypes.call(self, $deferred);
                    break;
                case (1) :
                    _handleNodeWithOneContentType.call(self, $deferred, allowedTypes[0]);
                    break;
                default :
                    _getSelectedContentTypeFromUser.call(self, allowedTypes)
                        .done(function (modalData) {
                            _handleSuccessfulContentTypeSelection.call(self, $deferred, modalData.selectedType);
                        })
                        .fail(function () {
                            _handleCanceledContentTypeSelection.call(self, $deferred);
                        });
                    break;
                }
            } else {
                _handleNodeWithZeroContentTypes.call(self, $deferred);
            }
        }

        function _handleNodeWithZeroContentTypes($deferred) {
            this.displayModal(
                {
                    msg : resources.contentType.noContentTypes,
                    hideConfirm: true
                })
                .always(_rejectDeferredThenNavigateBack.bind(this, $deferred));
        }

        function _handleNodeWithOneContentType($deferred, contentType) {
            this.model.set('meta.type', contentType._id);
            $deferred.resolve();
            _startContentDetailView.call(this);
        }

        function _getSelectedContentTypeFromUser(nodeData) {
            return this.displayModal(
                {
                    header : resources.contentType.selectContentType,
                    data : nodeData,
                    type : 'radio',
                    withSearch : true
                });
        }

        function _handleSuccessfulContentTypeSelection($deferred, selectedContentType) {
            this.model.set('meta.type', selectedContentType);
            $deferred.resolve();
            _startContentDetailView.call(this);
        }

        function _startContentDetailView() {
            var options = {
                meta : this.model.get('meta'),
                isNew : true
            };

            this.app.router.displayContentDetail(undefined, options);
        }

        function _handleCanceledContentTypeSelection($deferred) {
            $deferred.reject();
            _navigateBack.call(this);
        }

        function _handleFailedContentTypeRetrieval($deferred) {
            $deferred.reject();
        }

        function _rejectDeferredThenNavigateBack($deferred) {
            $deferred.reject();
            _navigateBack.call(this);
        }

        function _navigateBack (trigger) {
            this.app.router.removeThisRouteFromBreadcrumb();
            this.app.router.navigateBack(trigger);
        }

    });
