/*global define:false*/
define(['addFolderViewModel'], function (addFolderViewModel) {
    'use strict';

    return {
        name : 'addFolderView',
        ModelType : addFolderViewModel,
        modelData : {},
        listeners : [],
        events : {},
        permissions : ['admin', 'editor']
    };
});
