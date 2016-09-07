'use strict';

var path = require('path');

module.exports = function activate(grasshopperInstance) {
    console.log('Called activate on the Advanced Search plugin');

    return _insertTab(grasshopperInstance)
        .then(function() {
            return  { 'state' : 'good to go' };
        });
};

function _insertTab(grasshopperInstance) {
    return grasshopperInstance
            .request
            .content
            .insert({
                meta : {
                    type : grasshopperInstance.state.tabsContentTypeId,
                    hidden : true
                },
                fields : {
                    title : require('./config').title,
                    active : true,
                    href : '/admin/advanced-search',
                    iconclasses : 'fa fa-search',
                    roles : 'admin reader editor',
                    addedby : 'Advanced Search Plugin : Version '+ require(path.join(__dirname, 'package.json')).version,
                    sort : 0
                }
            })
            .then(function() {
                return { 'state' : 'good to go' };
            })
            .catch(function(err) {
                console.log(err);
            });
}
