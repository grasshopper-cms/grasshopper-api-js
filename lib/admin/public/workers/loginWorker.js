define(['api', 'jquery', 'resources', 'masseuse', 'helpers', 'constants'],
    function (Api, $, resources, masseuse, helpers, constants) {
        'use strict';

        var LocalStorage = helpers.localStorage,
            Cookies = helpers.cookies;

        /**
         * @class loginWorker
         */

        return {
            doLogin : doLogin,
            userIsStillValidUser : userIsStillValidUser
        };

        function doLogin () {
            var self = this,
                $deferred = $.Deferred();

            _getToken.call(this, this.model.get('username'), this.model.get('password'))
                .done(function(tokenObj) {
                    _setLocalStorageToken.call(self, tokenObj);
                    _setCookie.call(self, tokenObj);
                    _authenticateToken.call(self)
                        .done(_handleSuccessfulAuthentication.bind(self))
                        .fail(_handleFailedAuthentication.bind(self));
                })
                .fail(function(xhr) {
                    self.throwLoginError(resources.api.login.errors[xhr.status]);
                })
                .always($deferred.resolve);

            return $deferred.promise();
        }

        function _getToken(username, password) {
            return Api.getToken(username, password);
        }

        function _setLocalStorageToken(tokenObj) {
            if ('Token' === tokenObj.token_type) {
                LocalStorage.set('authToken', 'Basic '+ tokenObj.access_token);
            }
        }

        function _setCookie(tokenObj) {
            if ('Token' === tokenObj.token_type) {
                Cookies.set('authToken', 'Basic '+ tokenObj.access_token);
            }
        }

        function _authenticateToken() {
            return Api.authenticateToken(LocalStorage.get('authToken'));
        }

        function _handleSuccessfulAuthentication(userModel) {
            var redirect = LocalStorage.get(constants.loginRedirectKey);

            if(userModel.role !== 'external') {

                this.app.user.set(userModel);

                if (redirect && redirect !== undefined) {
                    LocalStorage.remove(constants.loginRedirectKey)
                        .done(this.app.router.navigateTrigger.bind(this.app.router, redirect));
                } else {
                    this.app.router.navigateTrigger(constants.internalRoutes.content);
                }

                this.model.clear();
                this.model.set('hideLoginForm',true);
            } else {
                this.model.clear();
                this.app.router.navigateTrigger(constants.internalRoutes.logout);
            }
        }

        function _handleFailedAuthentication() {
            this.app.router.navigateTrigger(constants.internalRoutes.login);
        }

        function userIsStillValidUser ($deferred) {
            var self = this,
                token = LocalStorage.get('authToken');
            if (token) {
                _checkAuthenticationOnApi.call(this, token, self, $deferred);
            } else {
                self.removeHeader();
                $deferred.reject();
            }
        }

        function _checkAuthenticationOnApi (token, self, $deferred) {
            if (!this.user.get('_id')) {
                this.$deferred = $deferred;
                Api.authenticateToken(token)
                    .done(_tokenIsValid.bind(self))
                    .fail(_tokenIsNotValid.bind(self));
            } else {
                verifyAuthToken.call(self, $deferred);
                if (!self.headerView) {
                    self.startHeader();
                }
                $deferred.resolve();
            }
        }

        function _tokenIsValid (data) {
            this.user.set(data);
            if (!this.headerView) {
                this.startHeader();
            }
            this.$deferred.resolve();
        }

        function _tokenIsNotValid () {
            this.goLogout();
            this.$deferred.reject();
        }

        function verifyAuthToken ($deferred) {
            var self = this;
            Api.authenticateToken(LocalStorage.get('authToken'))
                .error(function () {
                    $deferred.reject();
                    self.goLogout();
                });
        }

    });
