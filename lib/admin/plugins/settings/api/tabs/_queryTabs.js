'use strict';

var grasshopper = require('../../grasshopper');

module.exports = function() {
    return grasshopper
        .instance
        .request
        .content
        .query({
            filters :[
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : grasshopper.instance.state.tabsContentTypeId
                }
            ]
        });
};

