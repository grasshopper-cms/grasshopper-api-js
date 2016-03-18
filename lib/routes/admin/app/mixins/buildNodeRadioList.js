/* jshint loopfunc:true */
define(['jquery', 'underscore'],
    function ($, _) {

        'use strict';

        return {
            buildNodeRadioList : buildNodeRadioList
        };

        function buildNodeRadioList(el, collection) {
            var $el = $(el),
                $ul = $('<ul class="no-bullet"/>'),
                hasAncestors = [];

            if(collection.length) {

                collection.each(function(model) {
                    if(model.get('ancestors').length) {
                        hasAncestors.push(model);
                    } else {
                        $ul.append(getNodeRadioTemplate(model));
                    }
                });

                _.each(hasAncestors, function(model) {
                    // try and find the last ancestor
                    var lastAncestor = $ul.find('[value="'+ _.last(model.get('ancestors'))._id +'"]');
                    if(lastAncestor) {
                        lastAncestor.closest('li').append('<ul>'+ getNodeRadioTemplate(model) +'</ul>');
                    } else {
                        hasAncestors.push(model);
                    }
                });

                $el.append($ul);
            }
        }

        function getNodeRadioTemplate(model) {
            return '<li>' +
                '<input class="nodeRadio" type="radio" value="'+ model.get('_id') +'" name="nodeRadio" data-label="'+ model.get('label') +'" id="'+ model.get('_id') +'"/>' +
                '<label for="'+ model.get('_id') +'">'+ model.get('label') +'</label>' +
                '</li>';
        }

    });
