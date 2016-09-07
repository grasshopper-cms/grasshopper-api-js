/*global define:false*/
define(['addContentViewModel'], function (addContentModel) {
    'use strict';

    return {
        name : 'addContent',
        ModelType : addContentModel,
        browserTitle : 'Content',
        modelData : {},
        permissions : ['admin', 'editor']
    };
});
