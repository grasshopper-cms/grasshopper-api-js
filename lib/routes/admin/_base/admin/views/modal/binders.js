/* jshint loopfunc:true */
define(['jquery', 'underscore', 'constants'],
    function ($, _, constants) {

        'use strict';

        var fileExtensionsMap = constants.fileExtensionsMap,
            imageExtensions = constants.imageExtensions;

        return {
            checkfileextension : function(el, model) {
                var fileExtension = model ? _.last(model.split('.')).toLowerCase() : '';

                if ( _.has(fileExtensionsMap, fileExtension) ) {
                    $(el).removeClass('hide').addClass('fileExtension');
                    $(el).children().addClass(fileExtensionsMap[fileExtension]);
                } else if ( !_.has(fileExtensionsMap, fileExtension) &&
                                    (_.indexOf(imageExtensions, fileExtension) === -1) ) {
                    //Default behavior
                    $(el).removeClass('hide').addClass('fileExtension');
                    $(el).children().addClass('fa-file-o');
                }
            },
            checkfileextensionbutton : function(el, model) {
                var fileExtension = _.last(model.split('.'));

                if ( _.indexOf(imageExtensions, fileExtension) === -1 ) {
                    $(el).removeClass('hide');
                }
            }
        };



    });
