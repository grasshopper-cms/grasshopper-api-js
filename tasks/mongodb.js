module.exports = function (grunt) {
    'use strict';

    var host = "",
        async  = require('async'),
        client = require('mongodb').MongoClient,
        ObjectID = require('mongodb').ObjectID,
        users = [
            { _id: ObjectID("5246e73d56c02c0744000001"), role: "admin",enabled: true, name: "Test User", login: "apitestuseradmin", salt: "225384010328", pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "apitestuser@thinksolid.com" },
            { _id: ObjectID("5246e80c56c02c0744000002"), role: "reader", enabled: true, name: "Test User", login: "apitestuserreader", salt: "225384010328",pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "apitestuser@thinksolid.com" },
            { _id: ObjectID("52619b3dabc0ca310d000003"), role: "reader", enabled: true, name: "Test User With Editing permisions on a node", login: "apitestuserreader_1", salt: "225384010328",pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "apitestuser_1@thinksolid.com", permissions: [{nodeid : ObjectID("5261781556c02c072a000007"), role: "editor" }] },
            { _id: ObjectID("5261777656c02c072a000001"), role: "editor", enabled: true, name: "Test User", login: "apitestusereditor", salt: "225384010328",pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "apitestusereditor@thinksolid.com" },
            { _id: ObjectID("5261b811a94c1a971f000003"), role: "editor", enabled: true, name: "Test User", login: "apitestusereditor_restricted", salt: "225384010328",pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "apitestusereditor_1@thinksolid.com", permissions: [{nodeid : ObjectID("5261781556c02c072a000007"), role: "reader" }] },
            { _id: ObjectID("5245ce1d56c02c066b000001"), email: "apitestuser@thinksolid.com", login: "apitestuser", salt: "225384010328", pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", enabled: true, role: "reader", name: "Test User" }
        ],
        nodes = [
            { _id: ObjectID("5261781556c02c072a000007"), label: "Sample Node", slug: "sample_node", parent: null }
        ],
        contentTypes = [
            { _id: ObjectID("524362aa56c02c0703000001"), label: "This is my test content type", helpText: "", meta: [], description: "", fields: [{id: "testfield", required: true, instancing: 1, type: "textbox", label: "Title" } ]},
            {
                _id: ObjectID("5254908d56c02c076e000001"),
                label: "Users",
                description: "Protected content type that defines users in the system.",
                helpText: "These fields are the minimum required to create a user in the system. See more about extending users through plugins.",
                fields: {
                    login: {
                        label: "Login",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    },
                    name: {
                        label: "Name",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    },
                    email: {
                        label: "Email",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    },
                    role: {
                        label: "Role",
                        type: "dropdown",
                        required: true,
                        options: {
                            items: [
                                { id: "reader", val: "Reader" },
                                { id: "author", val: "Author" },
                                { id: "editor", val: "Editor" },
                                { id: "admin", val: "Admin" },
                                { id: "none", val: "None" }
                            ]
                        },
                        instancing: 1
                    },
                    password: {
                        label: "Email",
                        type: "password",
                        required: true,
                        instancing: 1
                    },
                    enabled: {
                        label: "Enabled",
                        type: "checkbox",
                        required: true,
                        instancing: 1
                    }
                },
                meta: [],
                protected: true
            }

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
        importData('contenttypes', col, callback);
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
