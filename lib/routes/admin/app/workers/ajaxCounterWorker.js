define(['jquery', 'underscore', 'constants'],
    function ($, _, constants) {
        'use strict';
        var requestsMidflight = 0,
            defaultRequestTimeout = constants.timeouts.showSpinnerLoadingTimeout;

        return {
            setupCounter: setupCounter
        };

        function setupCounter() {
            $.ajaxSetup({
                /* jslint unused: false */
                beforeSend: function (jqXHR, settings) {
                    if (requestFilter(jqXHR, settings)) {
                        var $deferred = new $.Deferred();

                        requestsMidflight++;

                        $deferred.then(showLoadingSpinner);

                        setTimeout(function () {
                            $deferred.resolve();
                        }, defaultRequestTimeout);

                        jqXHR.always(function (jqXHR, textStatus) {
                            requestsMidflight--;
                            $deferred.reject();
                            hideLoadingSpinner();
                        });
                    }
                }
            });
        }

        function requestFilter(jqXHR, settings) {
            var proto = settings.type.toLowerCase(),
                url =  settings.url.toLowerCase();

            if (proto=='get' && /\/node\/[^\/]+\/assets\/.+/.test(url)) {
                return false;
            }
            return true;
        }

        function showLoadingSpinner() {
            if (requestsMidflight > 0) {
                $('body').addClass('spinner-loading');
            }
        }

        function hideLoadingSpinner() {
            if (requestsMidflight <= 0) {
                $('body').removeClass('spinner-loading');
            }
        }

    });
