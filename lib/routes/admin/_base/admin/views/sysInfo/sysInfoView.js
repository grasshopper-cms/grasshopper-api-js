/*global define:false*/
define(['grasshopperBaseView', 'sysInfoViewConfig', 'jquery', 'api', 'constants'],
    function (GrasshopperBaseView, sysInfoViewConfig, $, api, constants) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions: sysInfoViewConfig,
            beforeRender: beforeRender,
            constants: constants
        });

        function beforeRender($deferred) {
            this.model.set('constants', constants);
            this.model.set('libraryVersions', JSON.parse(constants.libraryVersions));
            _getApiVersion.call(this)
                .done($deferred.resolve);
        }

        function _getApiVersion() {
            var $deferred = new $.Deferred(),
                self = this;

            api.getVersion()
                .done(function (versionDetails) {
                    self.model.set('apiVersions', versionDetails);
                    $deferred.resolve();
                });

            return $deferred.promise();
        }

    });
