'use strict';

var getTabsContentTypeId = require('../settings').getTabsContentTypeId,
    BB = require('bluebird'),
    config = require('./config');

module.exports = function deactivate(grasshopperInstance) {
    console.log('called deactivate on the Commerce plugin');

    return BB.bind({
        parentId : null,
        childrenIds : [],
        grasshopperInstance : grasshopperInstance
    })
        .then(_queryForThisPluginsTab)
        .then(function(queryResults) {
            this.parentId = queryResults.results.find(function(result) {
                return result.fields.title === config.title;
            })._id;
        })
        .then(_queryForThisPluginsChildren)
        .then(function(queryResults) {
            this.childrenIds = queryResults.results.map(function(result) {
                return result._id;
            });
        })
        .then(_deleteTheParent)
        .then(_deleteTheChildren);
};

function _queryForThisPluginsTab() {
    return this.grasshopper
            .request
            .content
            .query({
                filters : [
                    {
                        key : 'meta.type',
                        cmp : '=',
                        value : getTabsContentTypeId()
                    },
                    {
                        key : 'fields.title',
                        cmp : '=',
                        value : config.title
                    }
                ]
            });
}

function _queryForThisPluginsChildren() {
    return this.grasshopper
            .request
            .content
            .query({
                filters : [
                    {
                        key : 'meta.type',
                        cmp : '=',
                        value : getTabsContentTypeId()
                    },
                    {
                        key : 'fields.ancestors',
                        cmp : 'in',
                        value : [this.parentId.toString()]
                    }
                ]
            })
            .catch(function(err) {
                console.log(err);
            });
}

function _deleteTheParent() {
    return this.grasshopper
            .request
            .content
            .deleteById(this.parentId.toString());
}

function _deleteTheChildren() {
    var self = this;
    return BB.all(this.childrenIds.map(function(childId) {
        return self.grasshopperInstance
                .request
                .content
                .deleteById(childId.toString());
    }));
}
