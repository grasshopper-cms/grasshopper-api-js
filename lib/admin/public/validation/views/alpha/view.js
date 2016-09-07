/*global define:false*/
define(['grasshopperBaseView', 'validationAlphaConfig'],
    function (GrasshopperBaseView, validationAlphaConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : validationAlphaConfig
        });
    });
