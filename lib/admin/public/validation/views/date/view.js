/*global define:false*/
define(['grasshopperBaseView', 'validationDateConfig'],
    function (GrasshopperBaseView, validationDateConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : validationDateConfig
        });
    });
