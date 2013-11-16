(function(){
    "use strict";

    var node = {},
        db = require("../db"),
        assets = require("../assets"),
        _ = require("underscore"),
        async = require("async"),
        fs = require("fs");

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

    node.getByIdDeep = function(nodeId, callback){
        var nodeList = [];

        db.nodes.getById(nodeId, function(err, parentNode){
            if(err) { callback(err); return; }

            nodeList.push(parentNode);

            node.getChildNodesDeep(nodeId, function(err, nodes){
                nodeList = nodeList.concat(nodes);

                callback(null, nodeList);
            });
        });
    };

    /**
     * Recurrsively load node objects and also construct the children collection. This is used to build a tree of objects to traverse. The children are not parsed as part of the Query object
     * @param nodeId parent node ID. If root then it will except 0/null.
     */
    node.getChildNodesDeep = function(nodeId, callback){
        var nodeList = [];

        db.nodes.getByParent(nodeId, function(err, nodes){
            if(err) { callback(err); return; }

            function each(child, next){
                nodeList = nodeList.concat(child);

                node.getChildNodesDeep(child._id, function(err, nodes){
                    nodeList = nodeList.concat(nodes);
                    next(err);
                });

            }

            function done(){
                callback(null, nodeList);
            }

            async.forEachSeries(nodes, each, done);
        });
    };


    /**
     * Method that will return all of the files saved in a node.
     */
    node.getAssets = function(nodeid, callback){
        assets.list({nodeid: nodeid}, callback);
    };

    node.saveAsset = function(nodeid, filename, path, callback){
        assets.save({nodeid: nodeid, filename: filename, path: path}, callback);
    };

    node.renameAsset = function(nodeid, original, updated, callback){
        assets.rename({nodeid: nodeid, original: original, updated: updated}, callback);
    };

    node.moveAsset = function(nodeid, newnodeid, filename, callback){
        assets.move({nodeid: nodeid, newnodeid: newnodeid, filename: filename}, callback);
    };

    node.copyAsset = function(nodeid, newnodeid, filename, callback){
        assets.copy({nodeid: nodeid, newnodeid: newnodeid, filename: filename}, callback);
    };

    node.deleteAsset = function(nodeid, filename, callback){
        assets.delete({nodeid: nodeid, filename: filename}, callback);
    };

    node.deleteAllAssets = function(nodeid, callback){
        assets.deleteAll({nodeid: nodeid}, callback);
    };

    node.getFilesDeepLoad = function(){

    };

    node.deleteById = function(id, callback){
        // When we delete a node we also need to delete the subnodes
        this.getByIdDeep(id, function(err, nodeList){
            if(err) { callback(err); return; }

            function deleteNode(node, cb){
                var nodeid = node._id.toString();

                async.waterfall([
                    function(next){
                        db.nodes.deleteById(nodeid, function(err){
                            next(err, nodeid);
                        });
                    },
                    //function(next){
                    //TODO when content code is added then we also need to delete the content
                    //},
                    function(id, next){
                        assets.deleteAll({nodeid: id}, function(err){
                            next(err, id);
                        });
                    },
                    function(id, next){
                        assets.removeDirectory({nodeid: id}, next);
                    }
                ],function(err, data){
                    cb(err);
                });
            }

            function done(err){
                callback(err);
            }

            async.each(nodeList, deleteNode, done);
        });
    };

    node.create = function(obj, callback){
        async.waterfall([
            function(next){
                db.nodes.create(obj, function(err, val){
                    //[TODO] Call method to move all permissions down to the new node.
                    next(err, val);
                });
            },
            function(node, next){
                assets.createDirectory({nodeid: node._id.toString()}, function(err){
                    next(err, node);
                });
            }
        ], function(err, data){
            callback(err, data);
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