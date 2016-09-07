/*global define:false*/
define(['grasshopperBaseView', 'contentTypeDetailViewConfig',
    'resources', 'api', 'underscore', 'jquery', 'breadcrumbWorker', 'plugins', 'constants', 'mixins/handleRowClick'],
    function (GrasshopperBaseView, contentTypeDetailViewConfig,
              resources, Api, _, $, breadcrumbWorker, plugins, constants, handleRowClick) {
    'use strict';

    return GrasshopperBaseView.extend({
        defaultOptions : contentTypeDetailViewConfig,
        beforeRender : beforeRender,
        afterRender : afterRender,
        prepareToDeleteContentType : prepareToDeleteContentType,
        saveContentType : saveContentType,
        saveAndClose : saveAndClose,
        newContentType : newContentType,
        refreshAccordion : refreshAccordion,
        collapseAccordion : collapseAccordion,
        openSpecificAccordion : openSpecificAccordion
    })
        .extend(handleRowClick);

    function beforeRender($deferred) {
        var self = this;
        if (!this.model.has('label') && !this.model.isNew()) {
            this.model.fetch()
                .done(_handleSuccessfulModelFetch.bind(this, $deferred))
                .fail(self.app.router.navigateNotFound, $deferred.reject);
        } else if (this.model.isNew()) {
            _handleNewContentType.call(this, $deferred);
        } else {
            $deferred.resolve();
        }
    }

    function afterRender() {
        _initializeSortableAccordions.call(this);
        _initializeSelect2.call(this);
    }

    function _handleSuccessfulModelFetch($deferred) {
        this.collection.reset(this.model.get('fields'));
        _updateMastheadBreadcrumbs.call(this, $deferred, false);
    }

    function _handleNewContentType($deferred) {
        var textboxModelData = _.clone(_.findWhere(plugins.fields, { type : 'textbox' }).config.modelData);

        textboxModelData._id = 'title';
        textboxModelData.label = 'Title';
        this.collection.reset(textboxModelData);
        _updateMastheadBreadcrumbs.call(this, $deferred, true);
    }

    function prepareToDeleteContentType (e) {
        e.stopPropagation();
        _getContentTypesContent.call(this)
            .then(_warnUserBeforeDeleting.bind(this))
            .then(_actuallyDeleteContentType.bind(this));
    }

    function _warnUserBeforeDeleting(associatedContentCount) {
        var inflectedMessage;

        if(associatedContentCount) {
            inflectedMessage = (associatedContentCount > 1) ? 'pieces' : 'piece';
            inflectedMessage = associatedContentCount + ' ' + inflectedMessage;

            return this.displayModal(
                {
                    header : resources.warning,
                    msg : resources.contentType.deletionWarningWithAssociatedContent.replace(':count', inflectedMessage)
                });
        }

        return this.displayModal(
            {
                header : resources.warning,
                msg : resources.contentType.deletionWarningWithoutAssociatedContent
            });
    }

    function _getContentTypesContent() {
        var $deferred = new $.Deferred();

        Api.getContentByContentType(this.model.get('_id'))
            .done(function(results) {
                $deferred.resolve(results.total);
            })
            .fail($deferred.reject);

        return $deferred.promise();
    }

    function _actuallyDeleteContentType() {
        this.model.destroy(
            {
                success : _handleSuccessfulContentTypeDeletion.bind(this),
                error : _handleFailedContentTypeDeletion.bind(this)
            });
    }

    function _handleSuccessfulContentTypeDeletion(model) {
        this.displayTemporaryAlertBox(
            {
                header : resources.success,
                style : 'success',
                msg : resources.contentType.successfullyDeleted.replace(':item', model.get('label'))
            }
        );
    }

    function _handleFailedContentTypeDeletion(model) {
        this.fireErrorModal(resources.contentType.errorDeleted + model.get('label'));
    }

    function collapseAccordion() {
        this.$('#contentTypeFieldAccordion').accordion({ active : false });
    }

    function _openLastAccordion() {
        this.$('#contentTypeFieldAccordion').find(
            '.accordionHeader[modelid="'+ this.collection.last().cid +'"]').click();
    }

    function refreshAccordion() {
        this.$('#contentTypeFieldAccordion').accordion('refresh');
    }

    function openSpecificAccordion(index) {
        this.$('#contentTypeFieldAccordion').find(
            '.fieldAccordion[modelid="'+ this.collection.at(index).cid +'"]').click();
    }

    function saveContentType() {
        _saveContentTypeWorkflow.call(this, {});
    }

    function saveAndClose() {
        _saveContentTypeWorkflow.call(this, { close : true });
    }

    function _saveContentTypeWorkflow(options) {
        var self = this;

        this.model.toggle('saving');

        this.model.set('fields', this.collection.toJSON());

        _warnIfFirstFieldIsNotString.call(this)
            .done(function() {
                self.model.save()
                    .done(_handleSuccessfulModelSave.bind(self, options))
                    .fail(_handleFailedModelSave.bind(self));
            })
            .fail(function() {
                self.model.toggle('saving');
            });
    }

    function _warnIfFirstFieldIsNotString() {
        var $deferred = new $.Deferred();

        if(!this.model.isFirstFieldDataTypeAString()) {
            this.displayModal({
                header : resources.warning,
                msg : resources.contentType.validation.firstFieldIsNotAStringWarning
            })
                .done($deferred.resolve)
                .fail($deferred.reject);
        } else {
            $deferred.resolve();
        }

        return $deferred.promise();
    }

    function _handleSuccessfulModelSave(options) {
        this.collapseAccordion();
        this.displayTemporaryAlertBox(
            {
                header : resources.success,
                msg: resources.contentType.successfulSave,
                style : 'success'
            }
        );

        if(options.close) {
            this.app.router.navigateTrigger(constants.internalRoutes.contentTypes);
        } else {
            this.model.toggle('saving');

            this.app.router.navigateNinja(
                constants.internalRoutes.contentTypeDetail.replace(':id', this.model.get('_id')));

            breadcrumbWorker.resetBreadcrumb.call(this);
            _updateMastheadBreadcrumbs.call(this);
        }
    }

    function _handleFailedModelSave() {
        this.model.toggle('saving');

        this.fireErrorModal(this.model.validationError ? this.model.validationError : resources.contentType.failedSave);
    }

    function _updateMastheadBreadcrumbs($deferred, isNew) {
        breadcrumbWorker.contentTypeBreadcrumb.call(this, $deferred, (isNew));
    }

    function _initializeSelect2(){
        this.$contentTypePicker = $('.contentTypesDropdownSelect');

        this.$contentTypePicker.select2(
            {
                containerCssClass: 'contentTypesDropdownSelectContainer',
                dropdownCssClass: 'contentTypesDropdownSelectDrop',
                placeholder: resources.contentType.addNewField
            })
            .on('change', _addNewFieldToContentType.bind(this));
    }

    function _addNewFieldToContentType(e) {
        if (!e.val || e.val === '') {
            return;
        }

        var plugin = _.find(this.model.get('plugins'), function(itm) {
                return e.val == itm.name;
            }),
            model = _.result(plugin.config, 'modelData');

        this.collapseAccordion();
        model.isNew = true;
        this.collection.add(model);
        this.refreshAccordion();
        _openLastAccordion.call(this);
        this.$contentTypePicker.select2('val', '');
    }

    function _initializeSortableAccordions() {
        var $accordion = this.$('#contentTypeFieldAccordion');

        $accordion
            .accordion(
            {
                header : '.accordionHeader',
                icons : false,
                active : false,
                collapsible : true,
                disabled : false,
                heightStyle : 'content'
            })
            .sortable(
            {
                handle : '.fieldAccordion',
                revert : true,
                axis : 'y',
                start : _toggleAccordionEnabledDisabled.bind(this, $accordion),
                stop : _applyCollectionSort.bind(this, $accordion)
            }
        );
    }

    function _applyCollectionSort($accordion) {
        var fields = [],
            elements = {},
            $children = $accordion.children(),
            childLength = $children.length,
            i,
            self = this;

        $accordion.find('.fieldAccordion').each(function() {
            fields.push(self.collection.get($(this).attr('modelid')));
        });

        $children.each(function() {
            elements[$(this).attr('sortIndex')] = this;
        });

        for(i = 0; i < childLength; ++i) {
            $accordion.append(elements['sort'+ i]);
            $accordion.accordion('refresh');
        }

        this.collection.reset(fields);

        _toggleAccordionEnabledDisabled.call(this, $accordion);

    }

    function _toggleAccordionEnabledDisabled($accordion) {
        if($accordion.accordion( 'option', 'disabled' )) {
            $accordion.accordion( { disabled : false});
            $accordion.accordion( { active : false});
            $accordion.accordion('refresh');
        } else {
            $accordion.accordion( { disabled : true });
            $accordion.accordion('refresh');
        }
    }

    function newContentType() {
        if(this.model.isNew()) {
            this.app.router.displayContentTypeDetail();
        } else {
            this.app.router.navigateTrigger(constants.internalRoutes.newContentType);
        }
    }

});
