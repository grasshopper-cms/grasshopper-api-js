'use strict';

module.exports = function _nestChildTabsInParentTabs(queryResults) {
    return queryResults.results
        .filter(function(tab) {
            return !tab.fields.ancestors;
        })
        .map(function(tab) {
            tab.childTabs = queryResults.results
                .filter(function(childTab) {
                    return childTab.fields.ancestors && childTab.fields.ancestors.find(function(ancestor) {
                        return ancestor == tab._id.toString();
                    });
                });

            return tab;
        });
};