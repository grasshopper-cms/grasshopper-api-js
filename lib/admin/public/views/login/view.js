/*global define:false*/
define(['grasshopperBaseView', 'login/options', 'loginWorker', 'api'],
    function (GrasshopperBaseView, loginOptions, loginWorker, Api) {
    'use strict';

    return GrasshopperBaseView.extend({
        defaultOptions : loginOptions,
        afterRender : afterRender,
        login : login,
        loginWithGoogle : loginWithGoogle,
        throwLoginError : throwLoginError
    });

    function afterRender() {
        // Could only be oauth related.
        if(this.model.get('hasError')) {
            throwLoginError.call(this, this.model.get('oauthError'));
        }
    }

    function login () {
        if (this.model.isValid()) {
            _toggleSpinner.call(this);
            loginWorker.doLogin.call(this)
                .always(_toggleSpinner.bind(this));
        }
        return false;
    }

    function loginWithGoogle() {
        _toggleSpinner.call(this);

        Api.getGoogleUrl()
            .done(function(url) {
                window.location.href = url;
            })
            .fail(this.throwLoginError.bind(this));
    }

    function _toggleSpinner() {
        this.model.toggle('loggingIn');
    }

    function throwLoginError (xhr) {
        this.fireErrorModal(xhr);
    }

});
