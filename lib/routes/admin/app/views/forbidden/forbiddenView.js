/*global define:false*/
define(['grasshopperBaseView', 'forbiddenViewConfig'],
    function (GrasshopperBaseView, forbiddenViewConfig) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions: forbiddenViewConfig
        });

    });
