/*global define:false*/
define(['grasshopperBaseView', 'validationAlphaNumericConfig'],
    function (GrasshopperBaseView, validationAlphaNumericConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : validationAlphaNumericConfig
        });
    });
