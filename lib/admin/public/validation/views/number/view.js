/*global define:false*/
define(['grasshopperBaseView', 'validationNumberConfig'],
    function (GrasshopperBaseView, validationNumberConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : validationNumberConfig
        });
    });
