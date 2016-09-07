define(['constants', 'JSONEditor', 'underscore'], function (constants, JSONEditor, _) {
    'use strict';

    return {
        init: init
    };

    function init (selector, options) {
        var el;

        el = document.getElementById(selector);

        _.extend(options ? options : {}, constants.jsoneditor);

        return new JSONEditor(el, options, options.json);
    }

});
