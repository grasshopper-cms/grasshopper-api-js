/*global define:false*/
define(['grasshopperBaseView', 'infoViewConfig', 'jquery', 'api', 'constants'],
    function (GrasshopperBaseView, infoViewConfig, $, api, constants) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions: infoViewConfig,
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
