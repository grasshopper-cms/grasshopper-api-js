/*global define:false*/
define(['contentTypeDetailView', 'contentTypeDetailRowConfig'],
    function (contentTypeDetailView, contentTypeDetailRowConfig) {
        'use strict';

        return contentTypeDetailView.extend({
            defaultOptions : contentTypeDetailRowConfig
        });

    });
