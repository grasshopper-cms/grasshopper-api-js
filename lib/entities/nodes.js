(function(){
    "use strict";

    var node = {};

    /**
     * Method that will return a list of nodes from a parent
     * @param recurrsive If true you will get a generic list of all the child nodes as well as all the children of the child nodes.
     */
    node.getChildNodes = function(recurrsive){

    };

    /**
     * Recurrsively load node objects and also construct the children collection. This is used to build a tree of objects to traverse. The children are not parsed as part of the Query object
     * @param nodeId
     */
    node.deepLoadNodeList = function(){

    };


    /**
     * Method that will return all of the files saved in a node.
     */
    node.getFiles = function(){

    };


    node.delete = function(){

    };

    node.setTypes = function(types){

    };

    node.save = function(){

    };

    node.addPermissions = function(permissions){

    };

    node.getPermissions = function(){

    };

    /**
     * Initialize the node object with a configuration
     * @param config Object that includes information that this object needs like nodeid.
     */
    node.init = function(config){
        this.config = config;
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = node;
    }
})();