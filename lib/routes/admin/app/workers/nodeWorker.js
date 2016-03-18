define(['api', 'jquery', 'resources', 'contentTypeWorker', 'underscore', 'constants'],
    function (Api, $, resources, contentTypeWorker, _, constants) {
        'use strict';

        return {
            editName : editName,
            editContentTypes : editContentTypes,
            deleteNode : deleteNode
        };

        function editName() {
            var self = this,
                $deferred = new $.Deferred();

            $.when(_askUserForNewNodeName.call(this), this.model.fetch())
                .then(function(modalData) {
                    self.model.set('label', modalData.data);
                    _saveThisNode.call(self)
                        .done($deferred.resolve);
                });

            return $deferred.promise();
        }

        function editContentTypes() {
            _getAvailableContentTypes.call(this)
                .then(_askUserWhichContentTypesToAttach.bind(this))
                .then(_attachContentTypesToNode.bind(this));
        }

        function deleteNode() {
            _warnUserBeforeDeleting.call(this)
                .done(_actuallyDeleteNode.bind(this, true));
        }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function _askUserForNewNodeName() {
            return this.displayModal(
                {
                    header : resources.node.editName,
                    type : 'input',
                    data : this.model.get('label')
                });
        }

        function _saveThisNode() {
            var $deferred = new $.Deferred();

            this.model.save()
                .done(_handleSuccessfulNodeSave.bind(this, $deferred))
                .fail(_handleFailedNodeSave.bind(this, $deferred));

            return $deferred.promise();
        }

        function _handleSuccessfulNodeSave($deferred) {
            this.displayTemporaryAlertBox(
                {
                    header : resources.success,
                    style : 'success',
                    msg : resources.node.successfullyUpdated
                }
            );
            $deferred.resolve();
        }

        function _handleFailedNodeSave($deferred) {
            this.fireErrorModal(resources.node.errorUpdated);
            $deferred.reject();
        }

        function _getAvailableContentTypes() {
            return contentTypeWorker.getAvailableContentTypes(this.model.get('allowedTypes'));
        }

        function _askUserWhichContentTypesToAttach(availableContentTypes) {
            return this.displayModal(
                {
                    header : resources.contentType.editContentTypes,
                    type : 'checkbox',
                    withSearch : true,
                    data : availableContentTypes
                });
        }

        function _attachContentTypesToNode(modalData) {
            var selectedContentTypes = _.where(modalData.data, {checked: true}),
                contentTypeToPost = _.map(selectedContentTypes, function(type) {
                    return _.pick(type, 'label', 'helpText', '_id');
                });

            this.model.set('allowedTypes', contentTypeToPost);

            this.model.save()
                .done(_handleSuccessfulContentTypeAddition.bind(this))
                .fail(_handleFailedContentTypeAddition.bind(this));
        }

        function _handleSuccessfulContentTypeAddition() {
            this.displayTemporaryAlertBox(
                {
                    header : resources.success,
                    style : 'success',
                    msg : resources.contentType.contentTypeAdded
                }
            );
        }

        function _handleFailedContentTypeAddition(msg) {
            this.fireErrorModal(msg);
        }

        function _warnUserBeforeDeleting() {
            return this.displayModal(
                {
                    header : resources.warning,
                    msg : resources.node.deletionWarning
                });
        }

        function _actuallyDeleteNode() {
            var self = this;

            this.model.fetch()
                .then(function() {
                    self.model.destroy()
                        .done(_handleSuccessfulNodeDeletion.bind(self))
                        .fail(_handleFailedNodeDeletion.bind(self));
                });
        }

        function _handleSuccessfulNodeDeletion() {
            _redirectToParent.call(this);

            this.displayTemporaryAlertBox(
                {
                    header : resources.success,
                    style : 'success',
                    msg : resources.node.successfullyDeleted.replace(':item', this.model.get('label'))
                }
            );
        }

        function _handleFailedNodeDeletion() {
            this.fireErrorModal(resources.node.errorDeleted + this.model.get('label'));
        }

        function _redirectToParent() {
            var parent = this.model.get('parent');

            if(parent && parent._id) {
                this.app.router.navigateTrigger(constants.internalRoutes.nodeDetail.replace(':id', parent._id));
            } else {
                this.app.router.navigateTrigger(constants.internalRoutes.content);
            }

        }
    });
