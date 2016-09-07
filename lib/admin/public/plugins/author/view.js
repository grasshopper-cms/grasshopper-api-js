/*global define:false*/
define(['pluginBaseView', 'underscore', 'jquery', 'require', 'resources'],
    function (PluginBaseView, _, $, require, resources) {

        'use strict';

        return PluginBaseView.extend({
            beforeRender: beforeRender,
            afterRender: afterRender
        });

        function beforeRender($deferred) {
            if(!this.model.get('inSetup')) {
                this.model.get('users').fetch()
                    .fail(_handleFailedUserFetch.bind(this))
                    .always($deferred.resolve);
            }
            $deferred.resolve();
        }

        function afterRender() {
            if(!this.model.get('inSetup')) {
                _initializeSelect2.call(this);
            }
        }

        function _handleFailedUserFetch() {
            this.model.get('users').reset([ this.app.user ]);
            this.model.toggle('no_permissions');
        }

        function _initializeSelect2() {
            var value = this.model.get('value'),
                $select = this.$('select');

            $select.select2(
                {
                    containerCssClass : 'authorDropdownSelectContainer',
                    dropdownCssClass : 'authorDropdownSelectDrop',
                    placeholder : resources.plugins.author.selectUser,
                    allowClear : true
                })
                .on('change', _changeValue.bind(this));

            setTimeout(function() {
                $select.select2('val', value._id.toString());
            }, 500);
        }

        function _getValueStruct(_id) {
            var foundUser = this.model.get('users').findWhere({ _id : _id });

            if (foundUser){
                return {
                    _id : _id,
                    displayname : foundUser.get('displayname')
                };
            }
            // if no user found, return undefined
        }

        function _changeValue(e) {
            this.model.set('value', _getValueStruct.call(this, e.val));
        }

    });
