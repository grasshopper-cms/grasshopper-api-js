/*global define:false*/
define(['masseuse', 'alertBoxViewConfig'], function (masseuse, alertBoxViewConfig) {
    'use strict';
    var RivetView = masseuse.plugins.rivets.RivetsView;

    return RivetView.extend({
        defaultOptions : alertBoxViewConfig,
        afterRender : afterRender,
        hideAlertsOnNavigate : hideAlertsOnNavigate,
        closeAlertBox : closeAlertBox
    });

    function afterRender () {
        this.$el.fadeIn();
        if(this.model.get('temporary')) {
            _handleTemporaryAlertBox.call(this);
        }
    }

    function _handleTemporaryAlertBox() {
        var self = this;
        setTimeout(function() {
            self.$el && self.$el.fadeOut('400', self.remove.bind(self));
        }, 5000);


    }

    function hideAlertsOnNavigate() {
        if(!this.model.get('temporary')) {
            this.closeAlertBox();
        }
    }

    function closeAlertBox () {
        this.$el.fadeOut('400', this.remove.bind(this));
        return false;
    }

});
