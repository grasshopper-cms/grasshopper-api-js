define(['grasshopperModel', 'resources', 'constants', 'masseuse', 'helpers', 'underscore', 'jquery', 'backbone', 'mixins/validatePlugins', 'mixins/pluginSaveHook'],
    function(GrasshopperModel, resources, constants, masseuse, helpers, _, $, Backbone, validatePlugins, pluginSaveHook) {
        'use strict';

        var ComputedProperty = masseuse.ComputedProperty,
            cleanCollection = helpers.cleanCollection;

        return GrasshopperModel.extend({
            idAttribute: '_id',
            defaults: getDefaults,
            urlRoot: constants.api.content.url,
            save : save,
            toJSON: toJSON,
            validate: validate,
            parse: parse,
            resetContentLabel: resetContentLabel
        });

        function getDefaults() {
            var theDefaults = {
                constants : constants,
                resources: resources,
                href: new ComputedProperty(['_id'], function(id) {
                    return constants.internalRoutes.contentDetail.replace(':id', id);
                }),
                label: '',
                fields: {},
                saving: false,
                schema: null
            };

            if (constants.archivedContentFieldName) {
                theDefaults.archiveStatus = new ComputedProperty(['fields'], function() {
                    var archiveWindow, now;

                    if (!this.attributes.fields || !this.attributes.fields[constants.archivedContentFieldName]) {
                        return '--';
                    }

                    now = new Date();
                    archiveWindow = this.attributes.fields[constants.archivedContentFieldName];

                    if (new Date(archiveWindow.validTo) < now) {
                        return 'Archived';
                    }
                    if (new Date(archiveWindow.validFrom) > now) {
                        return 'Pending';
                    }
                    return 'Active';
                });
            }

            return theDefaults;
        }

        function save() {
            var self = this;

            this.trigger('change');

            return pluginSaveHook.save(this.get('fields'))
                .then(function() {
                    return GrasshopperModel.prototype.save.call(self, arguments);
                });
        }

        function toJSON() {
            var json = Backbone.Model.prototype.toJSON.apply(this);

            return cleanCollection($.extend(true, {}, _.pick(json, ['fields', 'meta', '_id'])));
        }

        function validate() {
            var err = false,
                validations;

            validations = _.compact(validatePlugins.validateOnContentSave());
            err = validations.length ? validations : false;

            if (err) {
                return err;
            }
        }

        function parse(response, options) {
            if (options.smartParse === true) {
                transplantProperties(response, this, '');
                return;
            }
            if (options.parse === false) {
                return _.omit(response, ['fields']);
                //                _.each(response.fields, function(field) {
                //                    this.set('fields.'+ field, )
                //                }.bind(this))
            }
            return response;
        }

        function transplantProperties(obj, where, keyPart) {
            var propName, propVal, keyName;
            for (propName in obj) {
                propVal = obj[propName];
                if (keyPart.length > 0) {
                    keyName = keyPart + '.' + propName;
                } else {
                    keyName = propName;
                }
                if (_.isObject(propVal)) {
                    transplantProperties(propVal, where, keyName);
                } else {
                    where.set(keyName, propVal);
                }
            }
        }

        function resetContentLabel() {
            if (this.get('isNew')) {
                this.set('label', resources.newWord + ' ' + this.get('schema.label'));
            } else {
                this.set('label', this.get('fields.' + this.get('meta.labelfield')));
            }
        }
    });
