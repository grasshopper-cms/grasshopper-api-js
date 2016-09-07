/*global define:false*/
define(['grasshopperBaseView', 'pluginWrapperViewConfig', 'underscore', 'require', 'jquery'],
    function (GrasshopperBaseView, pluginWrapperViewConfig, _, require, $) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : pluginWrapperViewConfig,
            beforeRender : beforeRender,
            afterRender : afterRender,
            addField : addField,
            removeField : removeField,
            resortMulti : _initializeSortableMulti
        });

        function beforeRender($deferred) {
            _getPlugin.call(this)
                .done(_handleMultiple.bind(this), $deferred.resolve);
        }

        function afterRender() {
            _initializeSortableMulti.call(this);
        }

        function _getPlugin() {
            var self = this,
                $deferred = $.Deferred();

            require(['plugins'], function(plugins) {
                var plugin = _.find(plugins.fields, {type : self.model.get('type')});

                // Ensuring Model Data is Obj that we can get into.
                plugin.config.modelData = _.result(plugin.config, 'modelData');

                self.model.set({
                    ViewModule : plugin.view,
                    configModule : plugin.config
                });

                $deferred.resolve();
            });

            return $deferred.promise();
        }

        function addField() {
            _addPlugin.call(this, undefined);
        }

        function removeField(e, context) {
            this.collection.remove(context.field);
            _evaluateMultiButtons.call(this);
        }

        function _handleMultiple() {
            var values = this.model.get('value'),
                minimum = this.model.get('min'),
                allowMultiple = this.model.get('configModule.modelData.allowMultiple'),
                i = 0,
                self = this;

            if (values && !_.isUndefined(allowMultiple) && allowMultiple === false) { // If values exists and allowMultiple is false.
                _addPlugin.call(this, values);
            } else if (values && _.isArray(values) && !_.isEmpty(values)) { // If values exists and is array that is not empty.
                _.each(values, function (value) {
                    _addPlugin.call(self, value);
                });
            } else if (values && _.isArray(values) && _.isEmpty(values)) { // If value exists and is an empty array.
                _evaluateMultiButtons.call(this);
            } else if (!!values || _.isString(values)) { // if values exists.
                _addPlugin.call(this, values);
            } else if (minimum === 0) { // if values does not exist and minimum is zero.
                this.collection.setValuesOnParentFieldsObject();
                _evaluateMultiButtons.call(this);
            } else { // if values does not exist and there is a minimum
                _evaluateMultiButtons.call(this);
                while(i < minimum) {
                    _addPlugin.call(self);
                    i++;
                }
            }
        }

        function _addPlugin(value) {
            var model = {
                value : _handleDefaultValue.call(this, value),
                options : this.model.get('options'),
                fieldId : this.model.get('_id')
            };

            this.collection.add(model);
            _evaluateMultiButtons.call(this);
        }

        function _handleDefaultValue(value) {
            //var defaultValue = this.model.attributes.defaultValue || this.model.attributes.configModule.modelData.value, copyOfDefaultValue={};
            var defaultValue = this.model.get('defaultValue') || this.model.get('configModule.modelData.value'),
                copyOfDefaultValue = {};

            if (_.isUndefined(value)) {
                /* Deep copy, if object */
                if (typeof(defaultValue)==='object'){
                    $.extend(true, copyOfDefaultValue, defaultValue);
                    return copyOfDefaultValue;
                }
                else {
                    return defaultValue;
                }
            } else {
                return value;
            }
        }

        function _evaluateMultiButtons() {
            _canShowAdditionButton.call(this);
            _canShowSubtractionButton.call(this);
            _canShowSortableMultiButton.call(this);
        }

        function _canShowAdditionButton() {
            this.model.set('showAdditionButton', this.collection.length < this.model.get('max'));
        }

        function _canShowSubtractionButton() {
            this.model.set('showSubtractionButton', this.collection.length > this.model.get('min'));
        }

        function _canShowSortableMultiButton() {
            this.model.set('showSortableButton', this.model.get('max') > 1 && this.collection.length > 1);
        }

        function _initializeSortableMulti() {
            var $sortable = this.$('#sortableMulti'+ this.model.cid);

            if(this.model.get('max') > 1) {
                $sortable
                    .sortable(
                    {
                        revert : true,
                        handle : '.sortableMultiHandle',
                        axis : 'y',
                        start : _fireSortStartEvent.bind(this),
                        stop : _applyMultiSort.bind(this, $sortable)
                    }
                );
            }
        }

        function _fireSortStartEvent() {
            this.channels.views.trigger('pluginWrapperSortStart');
        }

        function _fireSortStopEvent() {
            this.channels.views.trigger('pluginWrapperSortStop');
        }

        function _applyMultiSort($sortable) {
            var models = [],
                elements = {},
                $children = $sortable.children(),
                childLength = $children.length,
                self = this;

            $children.each(function() {
                var thisModelsId = $(this).children('.sortableMulti').attr('modelid');
                models.push(self.collection.get(thisModelsId)); // Create an array of models in the sorted order

                elements[$(this).attr('sortIndex')] = this; // create an object of elements in sorted order
            });

            _.times(childLength, function(index) {
                $sortable.append(elements['sort'+ index]); // Append the Elements to the parent in sorted order
            });

            this.collection.reset(models); // reset the model's collection in sorted order

            _fireSortStopEvent.call(this);
        }
    });
