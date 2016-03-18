/*global define:false*/
define(['grasshopperBaseView', 'mastheadViewConfig', 'underscore', 'jquery'],
    function (GrasshopperBaseView, mastheadViewConfig, _, $) {
    'use strict';
    return GrasshopperBaseView.extend({
        defaultOptions : mastheadViewConfig,
        beforeRender : beforeRender,
        afterRender : afterRender,
        setBreadcrumbs : setBreadcrumbs
    });

    function beforeRender () {
        this.setBreadcrumbs();
    }

    function afterRender() {
        $('#masthead').scrollToFixed();
    }

    function setBreadcrumbs (view) {
        if (view && view.model.has('breadcrumbs')) {
            this.model.set('breadcrumbs', _.flatten(_.clone(view.model.get('breadcrumbs'))));
        } else if (view && view.breadcrumbs) {
            this.model.set('breadcrumbs', view.breadcrumbs);
        } else {
            this.model.set('breadcrumbs', this.defaultBreadcrumbs);
        }
    }

});
