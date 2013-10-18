module.exports = function(app){
    "use strict";

    var node = {},
        internal = {},
        _ = require("underscore"),
        async = require("async"),
        LOGGING_CATEGORY = "GRASSHOPPER-NODE";

    internal.app = app;

    function validate(obj, cb){
        cb(null);
    }

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
    node.getChildNodesDeepLoad = function(nodeId){

    };


    /**
     * Method that will return all of the files saved in a node.
     */
    node.getFiles = function(){

    };

    node.getFilesDeepLoad = function(){

    };

    node.deleteById = function(id, callback){
        internal.app.db.nodes.deleteById(id, function(err, val){
            callback(err, val);
        });
    };

    node.setTypes = function(types){

    };

    node.create = function(obj, callback){
        validate(obj, function(err){
            if(err){
                callback(err);
            }
            else {
                internal.app.db.nodes.create(obj, function(err, val){
                    callback(err, val);
                });
            }
        });
    };

    node.update = function(obj, callback){
        validate(obj, function(err){
            if(err){
                callback(err);
            }
            else {
                internal.app.db.nodes.update(obj, function(err, val){
                    callback(err, val);
                });
            }
        })
    };

    node.addPermissions = function(permissions){

    };



    return node;
};