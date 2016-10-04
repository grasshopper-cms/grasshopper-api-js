'use strict';

var BB = require('bluebird'),
    omit = require('lodash/omit'),
    grasshopper = require('../../grasshopper');

module.exports = function(thisPlugin) {
    return function() {

        if(thisPlugin.tabs) {
            return BB
                .all(thisPlugin
                    .tabs
                    .map(function(tab) {
                        return _potentiallyAddThisTab(tab);
                    })
                )
                .catch(function(err) {
                    console.log('Adding Tabs Error ', err);
                });
        } else {
            return BB.resolve();
        }
    };
};

function _potentiallyAddThisTab(tab) {
    console.log(`Potentially Adding Tab ${tab.title}`);
    return _queryForThisTab(tab)
        .then(function(queryResults) {
            if(!queryResults.results.length) {
                console.log(`Could not find this tab, ${tab.title}, Adding it now.`);
                return _insertThisTab(tab);
            } else {
                console.log(`This tab was found, ${tab.title}, No need to add it.`);
                return queryResults.results[0];
            }
        })
        .then(function(addedTab) {
            if(tab.subTabs) {
                console.log(`This tab has sub tabs, ${tab.title}, Adding them now.`);
                return BB.all(tab
                    .subTabs
                    .map(function(subTab) {
                        subTab.ancestors = [ addedTab._id ];
                        return _potentiallyAddThisTab(subTab);
                    })
                );
            }
        });
}

function _queryForThisTab(tab) {
    console.log(`Querying for tab ${tab.title}`);
    return grasshopper
        .instance
        .request
        .content
        .query({
            filters : [
                {
                    key : 'meta.type',
                    cmp : '=',
                    value : grasshopper.instance.state.tabsContentTypeId
                },
                {
                    key : 'fields.title',
                    cmp : '=',
                    value : tab.title
                }
            ]
        });
}

function _insertThisTab(tab) {
    return grasshopper
            .instance
            .request
            .content
            .insert({
                meta : {
                    type : grasshopper.instance.state.tabsContentTypeId,
                    hidden : true
                },
                fields : omit(tab, ['subTabs'])
            })
            .then(function(result) {
                console.log(`Added this tab ${tab.title}`);
                return result;
            })
            .catch(function(err) {
                console.log(err);
            });
}