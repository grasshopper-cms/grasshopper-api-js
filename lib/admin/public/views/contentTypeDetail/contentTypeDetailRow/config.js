/*global define:false*/
define(['text!views/contentTypeDetail/contentTypeDetailRow/template.html', 'contentTypeDetailViewConfig', 'underscore'],
    function (template, contentTypeDetailViewConfig, _) {
        'use strict';

        return _.extend({}, contentTypeDetailViewConfig, {
            name : 'contentTypeDetailRow',
            template : template
        });
    });
