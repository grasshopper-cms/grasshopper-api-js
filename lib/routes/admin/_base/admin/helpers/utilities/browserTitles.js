define([], function () {
    'use strict';

    var documentTitle = 'Grasshopper';

    return {
        setBrowserTitle : function(browserTitle) {
            document.title = documentTitle + (browserTitle ? ' — ' + browserTitle : '');
        }
    };
});
