/*global define:false*/
define(['grasshopperBaseView', 'validationRegexConfig'],
    function (GrasshopperBaseView, validationRegexConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : validationRegexConfig
        });
    });
