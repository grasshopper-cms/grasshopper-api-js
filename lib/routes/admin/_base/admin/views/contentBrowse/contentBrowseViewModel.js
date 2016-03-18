define(['grasshopperModel', 'resources', 'constants',
    'contentBrowseViewChildNodesCollection', 'contentBrowseViewChildContentCollection', 'contentBrowseViewChildAssetsCollection'],
    function (Model, resources, constants,
              ChildNodesCollection, ChildContentCollection, ChildAssetsCollection) {

    'use strict';

    return Model.extend({
        idAttribute : 'nodeId',
        defaults : getDefaults,
        urlRoot : constants.api.node.url
    });

    function getDefaults() {
        return {
            resources : resources,
            constants : constants,
            childNodes : new ChildNodesCollection(),
            childContent : new ChildContentCollection(),
            childAssets : new ChildAssetsCollection(),
            currentContentSort : 'label-ascending',
            currentAssetsSort : 'label-ascending',
            nodeId : null,
            inRoot : null,
            limit : constants.pagination.defaultLimit,
            skip : constants.pagination.defaultSkip,
            contentSearchValue : ''
        };
    }

});
