/*global define:false*/
define(['grasshopperBaseView', 'headerViewConfig', 'constants', 'underscore'],  function (GrasshopperBaseView, headerViewConfig, constants, _) {

    'use strict';

    return GrasshopperBaseView.extend({
        defaultOptions : headerViewConfig,
        toggleNavigation : toggleNavigation,
        checkHeaderTab: checkHeaderTab,
        setActive: setActive
    });

    function toggleNavigation() {
        this.$el.find('#main-nav').slideToggle('fast');
    }

    function checkHeaderTab(view) {
        if(_.has(view, 'headerTab')) {
            switch (view.headerTab) {
                case 'advancedSearch':
                    this.setActive('#advancedSearch');
                    break;
                case 'users':
                    this.setActive('#users');
                    break;
                case 'content':
                    this.setActive('#items');
                    break;
                case 'contentTypes':
                    this.setActive('#contentTypes');
                    break;
                case 'sysInfo':
                    this.setActive('#sysInfo');
                    break;
                case 'help':
                    this.setActive('#help');
                    break;
                default:
                    this.setActive('#items');
            }
        }
    }

    function setActive(el) {
        this.$el.find('.nav-item-link').removeClass('active');
        this.$el.find(el).addClass('active');
    }

});
