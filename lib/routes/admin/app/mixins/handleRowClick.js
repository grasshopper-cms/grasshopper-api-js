/*global define:false*/
define([], function () {
    'use strict';
    return {
        handleRowClick : handleRowClick
    };

    function handleRowClick(e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.which != 2){
            this.app.router.navigateTrigger(this.model.get('href'));
        }
    }

});
