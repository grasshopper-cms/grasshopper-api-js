/*global define:false*/
define(['grasshopperBaseView', 'validationEmailConfig'],
    function (GrasshopperBaseView, validationEmailConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : validationEmailConfig
        });
    });
