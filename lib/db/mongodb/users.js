module.exports = (function(){
    "use strict";

    var _ = require("underscore"),
        mongoose = require('mongoose'),
        db = {};

    db.collectionName = 'users';
    db.schema = require('./schemas/user'),
    db.model = mongoose.model(db.collectionName, db.schema);
    db.privateFields = ["salt", "pass_hash"];

    function handleUser(err, doc, callback){
        if(err) {
            callback(err);
        }
        else if (doc != null) {
            callback(null, doc);
        }
        else {
            callback(new Error("User does not exist"));
        }
    }

    db.getByLogin = function(login, callback) {
        db.model.findOne({login: login}, this.buildIncludes()).lean().exec(function(err, doc){
            handleUser(err, doc, callback);
        });
    };

    db.getByEmail = function(email, callback) {
        db.model.findOne({email: email}, this.buildIncludes()).lean().exec(function(err, doc){
            handleUser(err, doc, callback);
         });
    };

    db.authenticate = function(login, password, callback){
        db.model.findOne({login: login}, function(err, doc){
            var valid = (doc != null) ? doc.authenticate(password) : false;

            if(!valid){
                handleUser(null, null, callback);
            }
            else {
                handleUser(err, doc, callback);
            }
        });
    };

    db.savePermissions = function(userId, nodeid, role, callback){
        db.model.findOne({_id: userId}, function(err, doc){
            if(err){
                callback(err);
            }
            else {
                var permissions = (!doc.permissions) ? [] : _.filter(doc.permissions, function(permission) {
                    return permission.nodeid.toString() != nodeid;
                });

                permissions[permissions.length] = {nodeid: nodeid, role: role};

                doc.permissions = permissions;
                doc.save(function(err, results){
                    callback(err, (!err) ? "Success" : null);
                });
         }
        });
    };

    db.deletePermission = function(userId, nodeId, callback){
        db.model.findOne({_id: userId}, function(err, doc){
            if(err){
                callback(err);
            }
            else {
                var permissions = (!doc.permissions) ? [] : _.filter(doc.permissions, function(permission) {
                    return permission.nodeid.toString() != nodeid;
                });

                doc.permissions = permissions;
                doc.save(function(err, results){
                    callback(err, (!err) ? "Success" : null);
                });
            }
        });
    };

    return _.extend(db, require("./mixins/crud"));
})();