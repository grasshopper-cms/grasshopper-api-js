module.exports = function(app){
    "use strict";

    var node = {},
        internal = {},
        _ = require("underscore"),
        async = require("async"),
        LOGGING_CATEGORY = "GRASSHOPPER-NODE";

    internal.app = app;

    node.getById = function(id, callback){
        internal.app.db.nodes.getById(id, function(err, val){
            callback(err, val);
        });
    };

    node.getBySlug = function(slug, callback){
        internal.app.db.nodes.getBySlug(slug, function(err, val){
            callback(err, val);
        });
    };

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
        internal.app.db.nodes.create(obj, function(err, val){
            //[TODO] Call method to move all permissions down to the new node.
            callback(err, val);
        });
    };

    node.update = function(obj, callback){
        internal.app.db.nodes.update(obj, function(err, val){
            callback(err, val);
        });
    };

    node.addContentTypes = function(id, obj, callback){
        var types = obj;
        if(!(obj instanceof Array)){
            types = [obj];
        }

        async.each(types, function(item, cb){
            internal.app.db.contentTypes.getById(item.id, function(err, doc){
                cb((err) ? new Error("Content type does not exist.") : null);
            });
        }, function(err){
            if(!err){
                internal.app.db.nodes.addContentTypes(id, types, function(err){
                    callback(err);
                });
            }
            else {
                callback(err);
            }
        });
    };

    node.deleteContentTypes = function(obj, callback){
        callback(null);
    };

    return node;
};