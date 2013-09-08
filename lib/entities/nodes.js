module.exports = function(app){
    "use strict";

    var node = {};

    /**
     * Method that will return a list of nodes from a parent
     * @param nodeId parent node ID. If root then it will except 0/null.
     * @param recurrsive If true you will get a generic list of all the child nodes as well as all the children of the child nodes.
     */
    node.getChildNodes = function(nodeId, recurrsive){

    };

    /**
     * Recurrsively load node objects and also construct the children collection. This is used to build a tree of objects to traverse. The children are not parsed as part of the Query object
     * @param nodeId parent node ID. If root then it will except 0/null.
     */
    node.deepLoadNodeList = function(nodeId){

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

    node.create = function(){

    };

    node.update = function(){

    }

    node.addPermissions = function(permissions){

    };

    /**
     * Initialize the node object with a configuration
     * @param config Object that includes information that this object needs like nodeid.
     */
    node.init = function(config){
        this.config = config;
    };

    return node;
};