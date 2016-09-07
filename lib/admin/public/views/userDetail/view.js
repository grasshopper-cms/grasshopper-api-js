/*global define:false*/
define(['grasshopperBaseView', 'userDetail/options', 'resources', 'constants', 'breadcrumbWorker', 'underscore',
    'mixins/handleRowClick', 'mixins/jsonEditor', 'helpers', 'api'],
    function (GrasshopperBaseView, options, resources, constants, breadcrumbWorker, _,
              handleRowClick, jsonEditor, helpers, Api) {

        'use strict';
        var LocalStorage = helpers.localStorage;

        return GrasshopperBaseView.extend({
            defaultOptions: options,
            beforeRender: beforeRender,
            afterRender: afterRender,
            saveUser: saveUser,
            saveAndClose: saveAndClose,
            toggleEnabled: toggleEnabled,
            deleteUser: deleteUser,
            addNewUser: addNewUser,
            toggleGoogle: toggleGoogle
        })
            .extend(handleRowClick);

        function beforeRender ($deferred) {
            this.model.fetch()
                .done(_updateMastheadBreadcrumbs.bind(this, $deferred));
        }

        function afterRender() {
            _setUpEnabledChangeWarning.call(this);
            _setUpJsonEditor.call(this);
        }

        // Google Identities
        function toggleGoogle() {
            if (this.model.get('hasGoogle')) {
                _unlinkGoogle.call(this);
            } else {
                _linkGoogle.call(this);
            }
        }

        function _unlinkGoogle() {
            if (this.model.get('hasBasic')) {
                _unlinkWithBasicRemaining.call(this);
            } else {
                _unlinkWithoutBasicRemaining.call(this);
            }
        }

        function _refreshModelAndDisplaySuccess() {
            this.model.fetch()
                .done(_displayUnlinkSuccessModal.bind(this))
                .fail(_unlinkFail.bind(this));
        }

        function _displayUnlinkSuccessModal() {
            this.displayModal(resources.user.unlinkSuccessModal);
        }

        function _unlinkFail() {
            this.app.router.goLogout();
        }

        function _linkGoogle() {
            this.displayModal(resources.user.linkModal)
                .done(_linkToModel.bind(this));
        }

        function _linkToModel() {
            LocalStorage.set(constants.loginRedirectKey, constants.profileGoogleLinkRedirect.url.replace(':id', this.model.get('_id')));
            _loginWithGoogle.call(this);
        }

        function _loginWithGoogle() {
            Api.getGoogleUrl()
                .done(function(url) {
                    window.location.href = url;
                })
                .fail(_throwLoginError.bind(this));
        }

        function _throwLoginError(xhr) {
            this.fireErrorModal(xhr);
        }

        function _unlinkWithBasicRemaining() {
            this.displayModal(resources.user.unlinkModalWithBasic)
                .done(_unlinkFromModel.bind(this));
        }

        function _unlinkWithoutBasicRemaining() {
            this.displayModal(resources.user.unlinkModalWithoutBasic)
                .done(_unlinkFromModel.bind(this));
        }

        function _unlinkFromModel() {
            this.model.get('userModel').unlinkGoogle()
                .done(_refreshModelAndDisplaySuccess.bind(this));
        }

        // Enabled / Disabled User attribute
        function toggleEnabled() {
            this.model.toggle('enabled');
            this.model.trigger('change:enabled');
            this.saveUser();
        }

        function _setUpEnabledChangeWarning() {
            var self = this;

            this.model.on('change:enabled', function () {
                if (self.model.get('userIsChangingTheirProfile') && self.model.get('enabled').toString() === 'false') {
                    _showSelfLockoutWarning.call(self)
                        .fail(function () {
                            self.model.set('enabled', self.model.previous('enabled'));
                        });
                }
            });
        }

        function _showSelfLockoutWarning() {
            return this.displayModal(
                {
                    header: resources.warning,
                    msg: resources.user.selfLockWarning
                });
        }

        // Add New User
        function addNewUser() {
            this.app.router.navigateTrigger(constants.internalRoutes.addUser);
        }

        // Breadcrumbs
        function _updateMastheadBreadcrumbs($deferred) {
            breadcrumbWorker.userBreadcrumb.call(this, $deferred);
        }

        // JSON Editor
        function _setUpJsonEditor() {
            var profile = this.model.get('profile');

            this.jsonEditor = jsonEditor.init('profile', {
                change: _jsonEditorChangeCallback.bind(this),
                json: profile
            });
        }

        function _jsonEditorChangeCallback() {
            this.model.set('profile', this.jsonEditor.get());
        }

        // Save User Methods
        function saveUser() {
            this.model.toggle('saving');
            _updateUserWorkflow.call(this, {});
        }

        function saveAndClose() {
            this.model.toggle('saving');
            _updateUserWorkflow.call(this, { close: true });
        }

        function _updateUserWorkflow(options) {
            this.model.save()
                .done(_handleSuccessfulSave.bind(this, options))
                .fail(_handleFailedSave.bind(this));
        }

        function _handleSuccessfulSave(options, model) {
            this.displayTemporaryAlertBox(
                {
                    header: resources.success,
                    style: 'success',
                    msg: resources.user.successfullyUpdated
                }
            );

            if (options.close) {
                this.app.router.navigateTrigger(constants.internalRoutes.users);
            } else {
                this.model.toggle('saving');
            }

            _updateNameInHeader.call(this, model);
        }

        function _handleFailedSave(xhr) {
            this.model.toggle('saving');

            this.fireErrorModal(xhr.responseJSON.message);
        }

        function _updateNameInHeader(model) {
            if (this.app.user.get('_id') === model._id) {
                this.app.user.set(model);
            }
        }

        // Delete User Methods
        function deleteUser() {
            _warnUserBeforeDeleting.call(this)
                .done(_actuallyDeleteUser.bind(this));
        }

        function _warnUserBeforeDeleting() {
            return this.displayModal(
                {
                    header: resources.warning,
                    msg: resources.user.delete.warningMessage
                });
        }

        function _actuallyDeleteUser() {
            this.model.destroy()
                .then(_handleSuccessfulUserDeletion.bind(this))
                .fail(_handleFailedUserDeletion.bind(this));
        }

        function _handleSuccessfulUserDeletion() {
            this.app.router.navigateTrigger(constants.internalRoutes.users);

            this.displayTemporaryAlertBox(
                {
                    header: resources.success,
                    style: 'success',
                    msg: resources.user.delete.success
                }
            );
        }

        function _handleFailedUserDeletion() {
            this.displayTemporaryAlertBox(
                {
                    header: resources.error,
                    style: 'error',
                    msg: resources.user.delete.failure
                }
            );
        }

    });
