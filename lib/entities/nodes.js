(function(){
    "use strict";

    var node = {},
        internal = {},
        db = require("../db"),
        assets = require("../assets"),
        _ = require("underscore"),
        async = require("async"),
        LOGGING_CATEGORY = "GRASSHOPPER-NODE";

    //internal.getChildNodes = function(id, callback){
    //    internal.app.db.nodes.getByParent(id, function(err, data){
    //        console.log(data);
    //    });
    //};

    node.getById = function(id, callback){
        db.nodes.getById(id, callback);
    };

    node.getBySlug = function(slug, callback){
        db.nodes.getBySlug(slug, callback);
    };

    /**
     * Method that will return a list of nodes from a parent
     * @param id parent node ID. If root then it will except 0/null.
     * @param recurrsive If true you will get a generic list of all the child nodes as well as all the children of the child nodes.
     */
    node.getChildNodes = function(id, recurrsive, callback){
        db.nodes.getByParent(id, function(err, nodes){
            callback(err, nodes);
        });
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
    node.getFiles = function(nodeid, callback){
        assets.list(nodeid, callback);
    };

    node.getFilesDeepLoad = function(){

    };

    node.deleteById = function(id, callback){
        db.nodes.deleteById(id, callback);
    };

    node.setTypes = function(types){

    };

    node.create = function(obj, callback){
        db.nodes.create(obj, function(err, val){
            //[TODO] Call method to move all permissions down to the new node.
            callback(err, val);
        });
    };

    node.update = function(obj, callback){
        db.nodes.update(obj, callback);
    };

    node.addContentTypes = function(id, obj, callback){
        var types = obj;
        if(!(obj instanceof Array)){
            types = [obj];
        }

        async.each(types, function(item, cb){
            db.contentTypes.getById(item.id, function(err, doc){
                cb((err) ? new Error("Content type does not exist.") : null);
            });
        }, function(err){
            if(!err){
                db.nodes.addContentTypes(id, types, function(err){
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

    module.exports = node;
})();