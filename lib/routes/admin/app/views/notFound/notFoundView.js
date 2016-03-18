/*global define:false*/
define(['grasshopperBaseView', 'notFoundViewConfig'],
    function (GrasshopperBaseView, notFoundViewConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions: notFoundViewConfig
        });

    });
