/*global define:false*/
define(['pluginBaseView', 'underscore'],
    function (PluginBaseView, _) {
        'use strict';

        return PluginBaseView.extend({
            afterRender : afterRender,
            calculateSlug : _.debounce(calculateSlug, 100)
        });

        function afterRender() {
            if(this.model.get('inSetup')) {
                _collectAvailableSluggables.call(this);
                _attachRefreshListenerToParentCollection.call(this);
            }
        }

        function _collectAvailableSluggables() {
            if (this.model) {
                var allStringFields = this.parent.parent.collection.where({ dataType: 'string' }),
                    allSluggableFields = _.filter(allStringFields, function (model) {
                        return model.get('type') !== 'slug';
                    });

                this.model.get('possibleFieldsToSlug').reset(allSluggableFields);
            }
        }

        function _attachRefreshListenerToParentCollection() {
            this.parent.parent.collection.on('add remove reset change', _collectAvailableSluggables.bind(this));
        }

        function calculateSlug(fields) {
            var fieldToSlugId = this.model.get('options'),
                newSlugableValue = fields[fieldToSlugId],
                currentSlugValue = fields[this.model.get('fieldId')];

            // will break the binding when slug changes first, this is intended
            if(currentSlugValue === this.model.get('oldSlugValue')) {
                this.model.set('oldSlugValue', _asSlug.call(this, newSlugableValue));
                this.model.set('value', _asSlug.call(this, newSlugableValue));
            }
        }

        function _asSlug(value) {
            if(!_.isUndefined(value)) {
                return value.toLowerCase().trim().replace(/[\s]+/g, '-').replace(/[^-a-zA-Z0-9._~]/g, '');
            }
        }

    });
