/*global define:false*/

define(['backbone', 'masseuse', 'resources', 'underscore', 'mousetrap', 'constants', 'mixins/alertBox', 'mixins/modal'],
    function (Backbone, masseuse, resources, _, mousetrap, constants, alertBox, modal) {
        'use strict';

        var RivetView = masseuse.plugins.rivets.RivetsView,
            defaultViewOptions = [
                '$deferred',
                'type',
                'defaultBreadcrumbs',
                'defaultMastheadButtons',
                'breadcrumbs',
                'privateBreadcrumbs',
                'mastheadButtons',
                'permissions',
                'nodeId',
                'wrapper',
                'appendTo',
                'collection',
                'browserTitle',
                'headerTab'
            ];

        return RivetView.extend({
            initialize : initialize,
            start : start,
            fireErrorModal : fireErrorModal,
            enter : enter,
            remove : remove,
            mastheadButtonsSelector : '#mastheadButtons'
        })
            .extend(alertBox)
            .extend(modal);

        function initialize (options) {
            options.viewOptions = options.viewOptions || [];
            options.viewOptions =  options.viewOptions.concat(defaultViewOptions);

            this.options = options;

            RivetView.prototype.initialize.apply(this, arguments);
        }

        function _initializeHotKeys() {
            if(_.has(this.options, 'hotkeys')) {
                _.each(this.options.hotkeys, function (hotkey) {
                    mousetrap.bind(hotkey.keys, this[hotkey.method].bind(this));
                }, this);
            }
        }

        function _handleAfterRender() {
            if (this.breadcrumbs && !this.privateBreadcrumbs) {
                this.channels.views.trigger('updateMastheadBreadcrumbs', this);
            }
            this.$el.foundation();
        }

        function start() {
            // Checking user permissions
            if (this.permissions && this.permissions.indexOf(this.app.user.get('role')) === -1) {
                this.app.router.navigateTrigger(constants.internalRoutes.forbidden, { replace : true }); //replace: true is essential otherwise stuck in a loop when pressing "back"
                return;
            }

            this.channels.views.trigger('checkHeaderTab', this);

            return RivetView.prototype.start.apply(this, arguments)
                .done(_handleAfterRender.bind(this), this.enter, _initializeHotKeys.bind(this));
        }

        function fireErrorModal(message) {
            return this.displayModal(
                {
                    header : resources.error,
                    type : 'error',
                    msg : message
                }
            );
        }

        function enter() {
            if(_.has(this.options, 'transitions') && _.has(this.options.transitions, 'enter')) {
                this.$el.velocity(this.options.transitions.enter.type, this.options.transitions.enter.options);
            } else if (_.has(this.options, 'transitions') && this.options.transitions === 'none') {

            } else {
                this.$el.velocity(constants.defaultPageTransitions.enter.type, constants.defaultPageTransitions.enter.options);
            }
        }

        function remove() {
            if(_.has(this.options, 'hotkeys')) {
                _.each(this.options.hotkeys, function (hotkey) {
                    mousetrap.unbind(hotkey.keys);
                }, this);
            }

            if(_.has(this.options, 'transitions') && _.has(this.options.transitions, 'exit')) {
               this.$el.velocity(this.options.transitions.exit, {
                   complete : RivetView.prototype.remove.bind(this, arguments)
               });
            } else {
                RivetView.prototype.remove.apply(this, arguments);
            }
        }

    });
