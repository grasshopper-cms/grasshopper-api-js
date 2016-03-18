/*global define:false*/
define(['grasshopperBaseView', 'addUser/options', 'resources', 'breadcrumbWorker', 'constants'],
    function (GrasshopperBaseView, options, resources, breadcrumbWorker, constants) {
    'use strict';

    return GrasshopperBaseView.extend({
        defaultOptions : options,
        beforeRender : beforeRender,
        saveUser : saveUser,
        addNewUser : addNewUser
    });

    function beforeRender($deferred) {
        _updateMastheadBreadcrumbs.call(this, $deferred);
    }

    function saveUser () {
        this.model.save()
            .success(_handleSuccessfulSave.bind(this))
            .error(_handleSaveError.bind(this));
    }

    function _handleSuccessfulSave () {
        this.app.router.navigateTrigger(constants.internalRoutes.users);
        this.displayTemporaryAlertBox(
            {
                header : resources.success,
                style : 'success',
                msg : resources.user.newUserAdded
            }
        );
    }

    function _handleSaveError (xhr) {
        this.fireErrorModal(xhr.responseJSON.message);
    }

    function _updateMastheadBreadcrumbs($deferred) {
        breadcrumbWorker.userBreadcrumb.call(this, $deferred, true);
    }

    function addNewUser() {
        this.app.router.displayAddUser();
    }
});
