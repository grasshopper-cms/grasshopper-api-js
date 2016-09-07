/*global define:false*/
define(['addAssetsViewModel'], function (addAssetsViewModel) {
    'use strict';

    return {
        name : 'addAssetsView',
        ModelType : addAssetsViewModel,
        modelData : {},
        listeners : [],
        events : {},
        permissions : ['admin', 'editor']
    };
});
