'use strict';

module.exports = function routeMatchesPath(route, path) {
    // NOTE Will only match Backbone Router Style Routes.
    // From Backbone Source: http://backbonejs.org/docs/backbone.html#section-195
    var optionalParam = /\((.*?)\)/g,
        namedParam    = /(\(\?)?:\w+/g,
        splatParam    = /\*\w+/g,
        escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    route = route.replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, function(match, optional) {
            return optional ? match : '([^/?]+)';
        })
        .replace(splatParam, '([^?]*?)');

    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$').test(path);
};