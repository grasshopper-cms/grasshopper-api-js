/*global define:false*/
define(['grasshopperBaseView', 'advancedSearch/config'],
    function (GrasshopperBaseView, config) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : config,
            afterRender : afterRender
        });

        function afterRender() {
            /*console.log('Check Tab');
            console.log(this.model.get('searchType'));*/
        }

    });
