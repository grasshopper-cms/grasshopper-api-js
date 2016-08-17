'use strict';

module.exports = function(nestedTabs) {
    return nestedTabs
        .sort(_sortTabList)
        .map(function(tab) {
            if(tab.childTabs.length) {
                tab.childTabs = tab.childTabs
                    .sort(_sortTabList);
            }

            return tab;
        });
};

function _sortTabList(tabA, tabB) { // Sort the top level tabs;
    if (parseInt(tabA.fields.sort) < parseInt(tabB.fields.sort)) {
        return -1;
    }

    if (parseInt(tabA.fields.sort) > parseInt(tabB.fields.sort)) {
        return 1;
    }

    return 0;
}