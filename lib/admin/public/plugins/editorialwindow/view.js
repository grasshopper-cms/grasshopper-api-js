/*global define:false*/
define(['pluginBaseView', 'moment', 'jquery', 'datetimepicker', 'resources'],
    function (PluginBaseView, moment, $, datetimepicker, resources) {
        'use strict';

        return PluginBaseView.extend({
            beforeRender: beforeRender,
            afterRender: afterRender,
            setValidFromToNow: setValidFromToNow,
            setValidToToNow: setValidToToNow,
            setValidToNeverExpire: setValidToNeverExpire
        });

        function beforeRender () {
            Date.parseDate = function (input, format) {
                return moment(input, format).toDate();
            };

            Date.prototype.dateFormat = function (format) {
                return moment(this).format(format);
            };
        }

        function afterRender ($deferred) {
            setTimeout(_addDateTimePickers.bind(this, $deferred), 100);
        }

        function _addDateTimePickers ($deferred) {
            this.$el.find('.datetimepicker').each(function () {
                $(this).datetimepicker({
                    startDate : moment(),
                    timepicker : true,
                    formatTime: 'h:mm a',
                    /*formatDate: 'YYYY/MM/DD',*/
                    format: resources.plugins.editorialWindow.dateFormat,
                    step: 1
                });
            });
            $deferred.resolve();
        }

        function setValidFromToNow () {
            this.model.set('value.validFrom', moment().toISOString());
        }

        function setValidToToNow () {
            this.model.set('value.validTo', moment().toISOString());
        }

        function setValidToNeverExpire () {
            this.model.set('value.validTo', moment('3000-12-31T12:00:00Z').toISOString());
        }

    });
