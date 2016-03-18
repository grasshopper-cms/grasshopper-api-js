/*global define:false*/
define(['grasshopperBaseView', 'validationRequiredConfig'],
    function (GrasshopperBaseView, validationRequiredConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : validationRequiredConfig
        });
    });
