/*global define:false*/
define(['underscore'], function (_) {
    'use strict';

    return {
        join : join,
        replace : replace
    };

    function join() {
        return _(arguments).toArray().join(' ');
    }

    function replace() {
        var args = _.toArray(arguments),
            initial = args.shift();

        function replacer (text, replacement) {
            return text.replace('%s', replacement);
        }

        return args.reduce(replacer, initial);
    }


});
