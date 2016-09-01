'use strict';

var grasshopperInstance = require('../../../../grasshopper/instance');

module.exports = function() {
    return grasshopperInstance
        .request
        .content
        .query({
            filters :[
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : require('../../index').getTabsContentTypeId()
                }
            ]
        });
};

