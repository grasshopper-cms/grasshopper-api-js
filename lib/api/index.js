/**
 * Module that is a proxy for all entity modules
 * Usage: api.proxy('users').<method>
 */
var api = function(){
    var entites = {
            token: require('./token'),
            users: require('./users'),
            nodes: require('./nodes'),
            contentTypes: require('./contentTypes')
        };

    this.proxy = function(entityName){
        return entites[entityName];
    };
};


module.exports = api;