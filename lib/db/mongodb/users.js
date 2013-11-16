"use strict";

var mongoose = require('mongoose'),
    crud = require("./mixins/crud"),
    _ = require("underscore"),
    collectionName = "users",
    schema = require('./schemas/user');

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

var user = Object.create(crud, {
    model: {value: mongoose.model(collectionName, schema)},
    privateFields: {value: ["salt", "pass_hash"]}
});

user.getByLogin = function(login, callback) {
    this.model.findOne({login: login}, this.buildIncludes()).lean().exec(function(err, doc){
        handleUser(err, doc, callback);
    });
};

user.getByEmail = function(email, callback) {
    this.model.findOne({email: email}, this.buildIncludes()).lean().exec(function(err, doc){
        handleUser(err, doc, callback);
    });
};

user.authenticate = function(login, password, callback){
    this.model.findOne({login: login}, function(err, doc){
        var valid = (doc != null) ? doc.authenticate(password) : false;

        if(!valid){
            handleUser(null, null, callback);
        }
        else {
            handleUser(err, doc, callback);
        }
    });
};

user.savePermissions = function(userId, nodeid, role, callback){
    this.model.findOne({_id: userId}, function(err, doc){
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

user.deletePermission = function(userId, nodeId, callback){
    this.model.findOne({_id: userId}, function(err, doc){
        if(err){
            callback(err);
        }
        else {
            var permissions = (!doc.permissions) ? [] : _.filter(doc.permissions, function(permission) {
                return permission.nodeid.toString() != nodeId;
            });

            doc.permissions = permissions;
            doc.save(function(err, results){
                callback(err, (!err) ? "Success" : null);
            });
        }
    });
};

module.exports = user;