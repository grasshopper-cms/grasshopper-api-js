define(['alertBoxView'], function(AlertBoxView) {
    'use strict';

    return {
        displayAlertBox: displayAlertBox,
        displayTemporaryAlertBox: displayTemporaryAlertBox,
        hideAlertBox: hideAlertBox
    };

    function displayAlertBox(options) {
        var alertBoxView = new AlertBoxView({
            modelData: options
        });
        alertBoxView.start();
    }

    function displayTemporaryAlertBox(options) {
        options.temporary = true;
        this.displayAlertBox(options);
    }

    function hideAlertBox() {
        this.channels.views.trigger('hideAlertBoxes');
    }

});
