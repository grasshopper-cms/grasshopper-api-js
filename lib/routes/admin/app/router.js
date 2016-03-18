/*global define*/
define([
    'jquery', 'backbone', 'underscore', 'masseuse', 'api', 'constants', 'helpers',
    'grasshopperBaseView',
    'login/view', 'loginWorker', 'logoutWorker', 'forbiddenView', 'notFoundView',
    'alertBoxView',
    'resources',
    'userDetail/view', 'UserModel',
    'headerView',
    'mastheadView',
    'userIndexView',
    'addUser/view',
    'contentBrowseView',
    'contentDetailView',
    'contentTypeIndexView',
    'contentTypeDetailView',
    'addFolderView',
    'addContentView',
    'addAssetsView',
    'sysInfoView',
    'advancedSearch/view',
    'helpView/view'
],
    function($, Backbone, _, masseuse, Api, constants, helpers,
              GrasshopperBaseView,
              LoginView, loginWorker, logoutWorker, ForbiddenView, NotFoundView,
              AlertBoxView,
              resources,
              UserDetailView, UserModel,
              HeaderView,
              MastheadView,
              UserIndexView,
              AddUserView,
              ContentBrowseView,
              ContentDetailView,
              ContentTypeIndexView,
              ContentTypeDetailView,
              AddFolderView,
              AddContentView,
              AddAssetsView,
              SysInfoView,
              AdvancedSearchView,
              HelpView
        ) {

        'use strict';
        var MasseuseRouter = masseuse.MasseuseRouter,
            LocalStorage = helpers.localStorage,
            userModel = new UserModel(),
            currentView,
            Router;

        /**
         * @class Router
         * @extends MasseuseRouter
         */
        Router = MasseuseRouter.extend({
            routes : {
                'login(/:token)' : 'displayLogin',
                'logout' : 'goLogout',
                'users(/limit/:limit/skip/:skip)' : 'displayUserIndex',
                'users(/limit/:limit/skip/:skip/query/:query)' : 'displayUserIndex',
                'user/:id' : 'displayUserDetail',
                'sys-info': 'displaySysinfo',
                'help': 'displayHelp',
                'add-user' : 'displayAddUser',
                'content-types' : 'displayContentTypeIndex',
                'content-types/new' : 'displayContentTypeDetail',
                'content-types(/:id)' : 'displayContentTypeDetail',
                'advanced-search(/:type/query=:queryOptions)' : 'displayAdvancedSearch',
                'items/nodeid/:nodeId/create-assets' : 'displayCreateAssets',
                'items/nodeid/:nodeId/create-folder' : 'displayCreateFolder',
                'items/nodeid/:nodeId/create-content' : 'displayCreateContent',
                'items(/nodeid/:nodeId/limit/:limit)' : 'displayContentBrowse',
                'items(/nodeid/:nodeId/limit/:limit/skip/:skip)' : 'displayContentBrowse',
                'items(/nodeid/:nodeId/limit/:limit/skip/:skip/query/:query)' : 'displayContentBrowse',
                'items(/nodeid/:nodeId)' : 'displayContentBrowse',
                'item/:id' : 'displayContentDetail',
                'forbidden' : 'displayForbidden',
                'not-found' : 'displayNotFound',
                '*path' : 'goHome'
            },

            breadcrumb  : [],

            user : userModel,
            initialize : initialize,
            startHeader : startHeader,
            removeHeader : removeHeader,

            onRouteFail : onRouteFail,
            beforeRouting : beforeRouting,
            excludeFromBeforeRouting : ['login(/:token)', 'logout'],
            userHasBreadcrumbs : userHasBreadcrumbs,
            removeThisRouteFromBreadcrumb : removeThisRouteFromBreadcrumb,
            getCurrentBreadcrumb : getCurrentBreadcrumb,

            navigateTrigger : navigateTrigger,
            navigateNinja : navigateNinja,
            navigateDeferred : navigateDeferred,
            navigateBack : navigateBack,
            navigateNotFound : navigateNotFound,

            loadMainContent : loadMainContent,

            goHome : goHome,
            displayLogin : displayLogin,
            goLogout : goLogout,
            navigate : navigate,
            displayUserIndex : displayUserIndex,
            displayUserDetail : displayUserDetail,
            displaySysinfo: displaySysinfo,
            displayHelp: displayHelp,
            displayAddUser : displayAddUser,
            displayContentBrowse : displayContentBrowse,
            displayContentDetail : displayContentDetail,
            displayContentTypeIndex : displayContentTypeIndex,
            displayContentTypeDetail : displayContentTypeDetail,
            displayCreateFolder : displayCreateFolder,
            displayCreateContent : displayCreateContent,
            displayCreateAssets : displayCreateAssets,
            displayAdvancedSearch : displayAdvancedSearch,
            displayForbidden: displayForbidden,
            displayNotFound: displayNotFound
        });

        function onRouteFail() {
            this.goLogout();
        }

        function beforeRouting() {
            var $deferred = new $.Deferred(),
                self = this;

            $deferred.done(function() {
                var fragment = Backbone.history.getFragment();
                if(fragment !== _.last(self.breadcrumb)) {
                    self.breadcrumb.push(fragment);
                }
            });

            loginWorker.userIsStillValidUser.call(this, $deferred);

            return $deferred.promise();
        }

        function userHasBreadcrumbs() {
            return (this.breadcrumb && this.breadcrumb.length > 1);
        }

        function removeThisRouteFromBreadcrumb() {
            this.breadcrumb.pop();
        }

        function getCurrentBreadcrumb() {
            return _.last(this.breadcrumb);
        }

        function _handleRoutingFromRefreshOnModalView(nodeId) {
            if(nodeId === '0') {
                nodeId = null;
                this.breadcrumb.unshift(constants.internalRoutes.content);
            } else {
                this.breadcrumb.unshift(constants.internalRoutes.nodeDetail.replace(':id', nodeId));
            }
            this.displayContentBrowse(nodeId);
        }

        function navigateTrigger(fragment, options, doBeforeRender) {
            options = options || {};
            options.trigger = true;
            this.navigate(fragment, options, doBeforeRender);
        }

        function navigateNinja(fragment, options) {
            options = options || {};
            options.replace = true;
            this.navigate(fragment, options);
        }

        function navigateDeferred(fragment, options) {
            options = options || {};
            options.deferred = true;
            this.navigate(fragment, options);
        }

        function navigateNotFound() {
            this.navigate(constants.internalRoutes.notFound, { trigger : true });
        }

        function navigateBack(trigger) {
            if (trigger) {
                this.navigateTrigger(this.breadcrumb[this.breadcrumb.length - 1]);
            } else {
                this.navigateNinja(this.breadcrumb[this.breadcrumb.length - 1]);
            }
        }

        function navigate(fragment, options, doBeforeRender) {
            if (currentView instanceof Backbone.View) {
                currentView.hideAlertBox.call(currentView);
            }
            if (doBeforeRender) {
                this.beforeRouting();
            }
            Backbone.Router.prototype.navigate.apply(this, arguments);
        }

        function initialize() {
            MasseuseRouter.prototype.initialize.apply(this, arguments);

            GrasshopperBaseView.prototype.channels.addChannel('views');

            GrasshopperBaseView.prototype.app = {
                router : this,
                user : this.user
            };
        }

        function loadMainContent(ViewType, config, bypass) {
            var $deferred = new $.Deferred(),
                newView = new ViewType(config);

            config = config || {};

            if (currentView && currentView.name === config.name && !bypass) {
                return $deferred.resolve(currentView)
                    .promise();
            }

            newView.on(GrasshopperBaseView.beforeRenderDone, function() {
                if (currentView) {
                    currentView.remove();
                }
                currentView = newView;
                $('#mastheadButtons').empty();
            });

            newView.start()
                .done(function () {
                    $deferred.resolve(newView);
                    helpers.browserTitles.setBrowserTitle(newView.browserTitle);
                })
                .fail(function () {
                    $deferred.reject();
                });

            return $deferred.promise();
        }

        function startHeader() {
            this.headerView = new HeaderView({
                modelData : {
                    userModel : this.user
                }
            });
            this.headerView.start();
            this.mastheadView = new MastheadView();
            this.mastheadView.start();
        }

        function removeHeader() {
            if (this.headerView && this.mastheadView) {
                this.headerView.remove();
                this.mastheadView.remove();
                this.headerView = null;
                this.mastheadView = null;
            }
        }

        function goLogout() {
            logoutWorker.doLogout.call(this)
                .done(this.navigate.bind(this, constants.internalRoutes.login, {trigger : true}, true));
        }

        function displayLogin(token) {
            var redirect = LocalStorage.get(constants.loginRedirectKey);

            if(token) {
                if (token.split('=')[0] == 'error') {
                    this.loadMainContent(LoginView, {modelData : {
                        oauthError : token.split('=')[1]
                    }});
                }
                // I am assuming this is a google token because that is all we support right meow.
                LocalStorage.set('authToken', 'Google '+ token);

                // Check if we have anything in localstorage telling us to redirect somewhere else after login
                if (redirect && redirect !== undefined) {
                    LocalStorage.remove(constants.loginRedirectKey)
                        .done(this.navigateTrigger.bind(this, redirect));
                } else  {
                    this.navigateTrigger(constants.internalRoutes.content);
                }

            } else {
                this.loadMainContent(LoginView);
            }

        }

        function goHome() {
            this.navigate(constants.internalRoutes.content, {trigger:true});
        }

        function displayUserDetail(id) {
            // I did the role check here instead of in the config with permissions, this is because there are Admin's
            // getting their own, Admins getting others, and others getting their own.
            if (this.user.get('role') === 'admin' || this.user.get('_id') === id) {
                this.loadMainContent(UserDetailView, {
                        modelData : {
                            _id : id,
                            userModel : this.user
                        }
                    });
            } else {
                this.navigateTrigger(constants.internalRoutes.forbidden);
            }
        }

        function displayUserIndex(limit, skip, query) {
            this.loadMainContent(UserIndexView, {
                    modelData : {
                        limit : limit ? limit : constants.pagination.defaultLimit,
                        skip : skip ? skip : constants.pagination.defaultSkip,
                        contentSearchValue : query ? query : ''
                    }
                });
        }

        function displayAddUser() {
            this.loadMainContent(AddUserView);
        }

        function displaySysinfo(){
            this.loadMainContent(SysInfoView);
        }

        function displayHelp() {
            this.loadMainContent(HelpView);
        }

        function displayContentBrowse(nodeId, limit, skip, query) {
            this.loadMainContent(ContentBrowseView, {
                    modelData : {
                        nodeId : nodeId ? nodeId : '0',
                        inRoot : !nodeId,
                        limit : limit ? limit : constants.pagination.defaultLimit,
                        skip : skip ? skip : constants.pagination.defaultSkip,
                        contentSearchValue : query ? query : ''
                    }
                });
        }

        function displayContentDetail(id, options) {
            this.loadMainContent(ContentDetailView, {
                    modelData : _.extend({}, options, {
                        _id : id
                    })
                });
        }

        function displayContentTypeIndex() {
            this.loadMainContent(ContentTypeIndexView);
        }

        function displayContentTypeDetail(id) {
            this.loadMainContent(ContentTypeDetailView, {
                    modelData : {
                        _id : id
                    }
                }, true);
        }

        function displayCreateFolder(nodeId) {
            if (!this.userHasBreadcrumbs()) {
                _handleRoutingFromRefreshOnModalView.call(this, nodeId);
            }
            var addFolderView = new AddFolderView({
                    modelData : {
                        nodeId : (nodeId) ? nodeId : null
                    }
                });
            addFolderView.start();
        }

        function displayCreateContent(nodeId) {
            if (!this.userHasBreadcrumbs()) {
                _handleRoutingFromRefreshOnModalView.call(this, nodeId);
            }
            this.loadMainContent(AddContentView, {
                    modelData : {
                        meta : {
                            node : nodeId
                        }
                    }
                });
        }

        function displayCreateAssets(nodeId) {
            if (!this.userHasBreadcrumbs()) {
                _handleRoutingFromRefreshOnModalView.call(this, nodeId);
            }
            var addAssetsView = new AddAssetsView({
                    modelData : {
                        nodeId : nodeId
                    }
                });
            addAssetsView.start();
        }

        function displayAdvancedSearch(searchType, queryOptions) {
            this.loadMainContent(AdvancedSearchView, {
                modelData : {
                    searchType : searchType ? searchType : 'content',
                    queryOptions : queryOptions ? JSON.parse(queryOptions) : null
                }
            });
        }

        function displayForbidden() {
            this.loadMainContent(ForbiddenView);
        }

        function displayNotFound() {
            this.loadMainContent(NotFoundView);
        }

        return Router;
    });
