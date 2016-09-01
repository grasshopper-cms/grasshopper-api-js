'use strict';

var grasshopper = require('../../grasshopper');

module.exports = function() {
    return grasshopper.instance
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

