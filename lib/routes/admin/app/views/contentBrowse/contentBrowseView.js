/*global define:false*/
define(['grasshopperBaseView', 'contentBrowseViewConfig', 'jquery', 'searchWorker',
    'underscore', 'breadcrumbWorker', 'constants', 'nodeWorker', 'addFolderViewConfig',
    'mixins/clipboardContextMenu', 'mixins/clipboardEvents'],
    function (GrasshopperBaseView, contentBrowseViewConfig, $, searchWorker,
              _, breadcrumbWorker, constants, nodeWorker, addFolderViewConfig,
              clipboardContextMenu, clipboardEvents) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : contentBrowseViewConfig,
            beforeRender : beforeRender,
            afterRender : afterRender,
            activateTab : activateTab,
            addAssetIndexView : addAssetIndexView,
            createContent : createContent,
            createAssets : createAssets,
            createFolder : createFolder,
            addNewNode : addNewNode,
            addNewAsset : addNewAsset,
            editNodeName : editNodeName,
            editNodeContentTypes : editNodeContentTypes,
            deleteNode : deleteNode,
            getChildContent : getChildContent,
            searchContent : searchContent,
            hasCreateFolderPermission: hasCreateFolderPermission,
            toggleSortContentByLabel : toggleSortContentByLabel,
            toggleSortContentByType : toggleSortContentByType,
            toggleSortByLastModified : toggleSortByLastModified,
            toggleSortAssetsByLabel : toggleSortAssetsByLabel,
            toggleSortAssetsBySize : toggleSortAssetsBySize,
            toggleSortAssetsByModified : toggleSortAssetsByModified,
            remove : remove
        })
            .extend(clipboardContextMenu)
            .extend(clipboardEvents);

        function beforeRender ($deferred) {
            this.model.get('childAssets').nodeId = this.model.get('nodeId');
            this.model.get('childNodes').nodeId = this.model.get('nodeId');
            this.model.get('childContent').nodeId = this.model.get('nodeId');
            this.model.get('childContent').limit = this.model.get('limit');
            this.model.get('childContent').skip = this.model.get('skip');

            $.when(
                    _buildMastheadBreadcrumb.call(this),
                    this.model.fetch(),
                    this.model.get('childNodes').fetch(),
                    this.getChildContent(),
                    this.addAssetIndexView())
                .done($deferred.resolve)
                .fail($deferred.reject);
        }

        function afterRender () {
            this.initClipboardMenu('#contentPanel');
            this.initializeClipboardListeners('#contentPanel');
            this.initClipboardMenu('#assetIndex');
            this.initializeClipboardListeners('#assetIndex');
            this.setupClipboardEvents();
        }

        function addAssetIndexView() {
            if (!this.model.get('inRoot')) {
                this.model.get('childAssets').reset();
                return this.model.get('childAssets').fetch();
            }
        }

        function _buildMastheadBreadcrumb () {
            var $deferred = new $.Deferred();

            breadcrumbWorker.contentBrowse.call(this, $deferred);

            return $deferred.promise();
        }

        function getChildContent() {
            if(!this.model.get('inRoot')) {
                return this.searchContent(undefined, undefined, true);
            }
        }

        function activateTab (tab) {
            $('#' + tab + ' a').click();
        }

        function createContent() {
            this.app.router.navigateTrigger(
                constants.internalRoutes.addContent.replace(':id', this.model.get('nodeId')));
        }

        function createAssets() {
            this.app.router.navigateTrigger(
                constants.internalRoutes.createAssets.replace(':id', this.model.get('nodeId')));
        }

        function createFolder() {
            this.app.router.navigateTrigger(
                constants.internalRoutes.createFolder.replace(':id', this.model.get('nodeId')));
        }

        function addNewNode(nodeName) {
            this.model.get('childNodes').add({
                label : nodeName,
                parent : this.model.get('nodeId')
            });
        }

        function addNewAsset(newAssetPayload) {
            this.model.get('childAssets').add(newAssetPayload);
        }

        function editNodeName() {
            nodeWorker.editName.call(this)
                .done(breadcrumbWorker.resetBreadcrumb.bind(this), _buildMastheadBreadcrumb.bind(this));
            _closeActionsDropdown.call();
        }

        function editNodeContentTypes() {
            nodeWorker.editContentTypes.call(this);
            _closeActionsDropdown.call();
        }

        function deleteNode() {
            nodeWorker.deleteNode.call(this);
            _closeActionsDropdown.call();
        }

        function _closeActionsDropdown() {
            $('#actionsDropdown').click();
        }

        function hasCreateFolderPermission(){
            var role = this.app.user ? this.app.user.get('role') : undefined;

            return _.contains(addFolderViewConfig.permissions, role);
        }

        function searchContent(e, context, isFirstQuery) {
            return searchWorker.searchContent.call(this, e, context, 'childContent', true, isFirstQuery);
        }

        function toggleSortContentByLabel() {
            var currentContentSort = this.model.get('currentContentSort'),
                childNodesCollection = this.model.get('childNodes'),
                childContentCollection = this.model.get('childContent');

            if(currentContentSort === 'label-ascending') {
                childContentCollection.sortByLabelDescending();
                childNodesCollection.sortByLabelDescending();
                this.model.set('currentContentSort', 'label-descending');
            } else {
                childContentCollection.sortByLabelAscending();
                childNodesCollection.sortByLabelAscending();
                this.model.set('currentContentSort', 'label-ascending');
            }
        }

        function toggleSortContentByType() {
            var currentContentSort = this.model.get('currentContentSort'),
                childContentCollection = this.model.get('childContent');

            if(currentContentSort === 'type-ascending') {
                childContentCollection.sortByTypeDescending();
                this.model.set('currentContentSort', 'type-descending');
            } else {
                childContentCollection.sortByTypeAscending();
                this.model.set('currentContentSort', 'type-ascending');
            }
        }

        function toggleSortByLastModified() {
            var currentContentSort = this.model.get('currentContentSort'),
                childContentCollection = this.model.get('childContent');

            if(currentContentSort === 'modified-ascending') {
                childContentCollection.sortByModifiedDescending();
                this.model.set('currentContentSort', 'modified-descending');
            } else {
                childContentCollection.sortByModifiedAscending();
                this.model.set('currentContentSort', 'modified-ascending');
            }
        }

        function toggleSortAssetsByLabel() {
            var currentAssetsSort = this.model.get('currentAssetsSort'),
                childAssetsCollection = this.model.get('childAssets');

            if(currentAssetsSort === 'label-ascending') {
                childAssetsCollection.sortByLabelDescending();
                this.model.set('currentAssetsSort', 'label-descending');
            } else {
                childAssetsCollection.sortByLabelAscending();
                this.model.set('currentAssetsSort', 'label-ascending');
            }
        }

        function toggleSortAssetsBySize() {
            var currentAssetsSort = this.model.get('currentAssetsSort'),
                childAssetsCollection = this.model.get('childAssets');

            if(currentAssetsSort === 'size-ascending') {
                childAssetsCollection.sortBySizeDescending();
                this.model.set('currentAssetsSort', 'size-descending');
            } else {
                childAssetsCollection.sortBySizeAscending();
                this.model.set('currentAssetsSort', 'size-ascending');
            }
        }

        function toggleSortAssetsByModified() {
            var currentAssetsSort = this.model.get('currentAssetsSort'),
                childAssetsCollection = this.model.get('childAssets');

            if(currentAssetsSort === 'modified-ascending') {
                childAssetsCollection.sortByModifiedDescending();
                this.model.set('currentAssetsSort', 'modified-descending');
            } else {
                childAssetsCollection.sortByModifiedAscending();
                this.model.set('currentAssetsSort', 'modified-ascending');
            }
        }

        function remove() {
            this.removeClipboardMenu();
            this.removeClipboardEvents();
            GrasshopperBaseView.prototype.remove.call(this);
        }

    });
