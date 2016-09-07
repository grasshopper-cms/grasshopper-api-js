/*global define:false*/

define(['grasshopperBaseView', 'mixins/pluginSaveHook'], function (GrasshopperBaseView, pluginSaveHook) {
        'use strict';

    return GrasshopperBaseView.extend({
        start : start,
        remove : remove
    });

    function start() {
        pluginSaveHook.register(this);

        return GrasshopperBaseView.prototype.start.apply(this, arguments);
    }

    function remove() {
        pluginSaveHook.remove(this);

        return GrasshopperBaseView.prototype.remove.apply(this, arguments);
    }

});
