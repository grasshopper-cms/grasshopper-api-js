module.exports = function (grunt) {
    'use strict';

    var host = "",
        async  = require('async'),
        client = require('mongodb').MongoClient,
        ObjectID = require('mongodb').ObjectID,
        users = [
            { _id: ObjectID("5246e73d56c02c0744000001"), role: "admin",enabled: true, name: "Test User", login: "apitestuseradmin", password: "TestPassword", email: "apitestuser@thinksolid.com" },
            { _id: ObjectID("5246e80c56c02c0744000002"), role: "reader", enabled: true, name: "Test User", login: "apitestuserreader", password: "TestPassword", email: "apitestuser@thinksolid.com" },
            { _id: ObjectID("5245ce1d56c02c066b000001"), email: "apitestuser@thinksolid.com", login: "apitestuser", password: "TestPassword", enabled: true, role: "reader", name: "Test User" }
        ],
        contentTypes = [
            { _id: ObjectID("524362aa56c02c0703000001"), label: "This is my test content type", helpText: "", meta: [], description: "", fields: [{id: "testfield", required: true, instancing: 1, type: "textbox", label: "Title" } ]}
        ],
        content = [],
        nodes = [];

    function cleanCollection(col, callback){
        client.connect(host, function(err, db) {
            db.collection(col, function(err, collection){
                collection.remove({}, function(err, numRemovedDocs){
                    grunt.log.writeln(numRemovedDocs + " documents removed from " + col + " collection.");
                    db.close();
                    callback();
                });
            });
        });
    }

    function importData(col, obj, callback){
        client.connect(host, function(err, db) {
            db.collection(col, function(err, collection){
                collection.insert(obj, function(err){
                    db.close();
                    callback();
                });
            });
        });
    }

    function importUsers(col, callback){
        importData('users', col, callback);
    }

    function importNodes(col, callback){
        importData('nodes', col, callback);
    }

    function importContentTypes(col, callback){
        importData('contentTypes', col, callback);
    }

    function importContent(col, callback){
        importData('content', col, callback);
    }

    grunt.registerMultiTask('mongodb', 'Runs a nodemon monitor of your node.js server.', function () {
        var done = this.async(),
            collections = this.data.collections;

        host = this.data.host;

        grunt.log.writeln("Cleaning up test database, starting from clean slate.");

        async.series([
            function(callback){
                async.each(collections, cleanCollection, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Collections clean.");
                    callback();
                });
            },
            function(callback){
                async.each(users, importUsers, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Test `users` imported.");
                    callback();
                });
            },
            function(callback){
                async.each(contentTypes, importContentTypes, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Test `contentTypes` imported.");
                    callback();
                });
            },
            function(callback){
                async.each(nodes, importNodes, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Test `nodes` imported.");
                    callback();
                });
            },
            function(callback){
                async.each(content, importContent, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Test `content` imported.");
                    callback();
                });
            }
        ],function(err){
            if(err){
                grunt.log.error(err);
            }

            done();
        });
    });
};
