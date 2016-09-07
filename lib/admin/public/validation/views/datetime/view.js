/*global define:false*/
define(['grasshopperBaseView', 'validationDatetimeConfig'],
    function (GrasshopperBaseView, validationDatetimeConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : validationDatetimeConfig
        });
    });
