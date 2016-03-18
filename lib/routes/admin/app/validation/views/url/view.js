/*global define:false*/
define(['grasshopperBaseView', 'validationUrlConfig'],
    function (GrasshopperBaseView, validationUrlConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : validationUrlConfig
        });
    });
