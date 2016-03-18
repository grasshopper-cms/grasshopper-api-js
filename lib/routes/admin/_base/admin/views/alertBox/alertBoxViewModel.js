define(['grasshopperModel', 'masseuse'], function (GrasshopperModel, masseuse) {
    'use strict';

    var ComputedProperty = masseuse.ComputedProperty;

    return GrasshopperModel.extend({
        defaults : {
            error : '',
            icon : new ComputedProperty(['style'], function(style) {
                switch (style) {
                case 'success' :
                    return 'fa-check';
                case 'info' :
                    return 'fa-info';
                case 'error' :
                    return 'fa-ban';
                case 'warning' :
                    return 'fa-exclamation-triangle';
                }
            })
        }
    });
});
