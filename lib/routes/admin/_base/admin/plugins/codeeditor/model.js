define(['grasshopperModel', 'resources', 'masseuse', 'underscore'], function (Model, resources, masseuse, _) {

    'use strict';

    var ComputedProperty = masseuse.ComputedProperty;

    return Model.extend({
        defaults : function() {
            return {
                resources : resources,
                loading : false,
                possibleLanguages : [ // these live ace/mode/<name underscore>
                    'javascript',
                    'html',
                    'css',
                    'json',
                    'markdown'
                ],
                possibleThemes : [ // these live ace/theme/<name underscore>
                    'light', // => github
                    'dark' // => monokai
                ],
                currentThemeLocation : new ComputedProperty(['options'], function(options) {
                    if(_.has(options, 'theme')) {
                        return 'ace/theme/' + options.theme.replace('light', 'github').replace('dark', 'monokai');
                    }
                    return;
                }),
                currentModeLocation : new ComputedProperty(['options'], function(options) {
                    if(_.has(options, 'language')) {
                        return 'ace/mode/' + options.language.replace(' ', '_');
                    }
                    return;
                })
            };
        }
    });

});
