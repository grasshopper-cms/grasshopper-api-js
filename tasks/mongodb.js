module.exports = function (grunt) {
    'use strict';

    var host = "",
        async  = require('async'),
        client = require('mongodb').MongoClient,
        ObjectID = require('mongodb').ObjectID,
        hookEvents = [
            { _id: ObjectID("5261781556c02c072a000007"), name: "ContentCreated", description: "Hook gets fired after a piece of content gets created." },
            { _id: ObjectID("526d5179966a883540000006"), name: "ContentDeleted", description: "Hook gets fired after a piece of content gets deleted." },
            { _id: ObjectID("526417710658fc1f0a00000b"), name: "ContentUpdated", description: "Hook gets fired after a piece of content gets updated." },
            { _id: ObjectID("5246e73d56c02c0744000001"), name: "NodeCreated", description: "Hook gets fired after a node gets created." },
            { _id: ObjectID("5246e80c56c02c0744000002"), name: "NodeDeleted", description: "Hook gets fired after a node gets deleted." },
            { _id: ObjectID("52619b3dabc0ca310d000003"), name: "NodeUpdated", description: "Hook gets fired after a node gets updated." },
            { _id: ObjectID("5261777656c02c072a000001"), name: "BeforeAuthentication", description: "Hook gets fired before a user gets authenticated in the system." },
            { _id: ObjectID("52712a3e2eacd5a714000002"), name: "AfterAuthentication", description: "Hook gets fired after a user gets authenticated." },
            { _id: ObjectID("52712a3e2eacd5a714000001"), name: "RetrieveIdentity", description: "Hook for working around the default user authentication. A 3rd party system could be added as a proxy to verify the identities of users." },
            { _id: ObjectID("52712a3e2eacd5a714000006"), name: "ContentLoaded", description: "Hook gets fired when a piece of content gets loaded." }
        ],
        users = [
            { _id: ObjectID("5246e73d56c02c0744000001"), role: "admin",enabled: true, firstname: "Test", lastname: "User", login: "apitestuseradmin", salt: "225384010328", pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "apitestuser@thinksolid.com" },
            { _id: ObjectID("5246e80c56c02c0744000002"), role: "reader", enabled: true, firstname: "Test", lastname: "User", login: "apitestuserreader", salt: "225384010328",pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "apitestuser@thinksolid.com" },
            { _id: ObjectID("52619b3dabc0ca310d000003"), role: "reader", enabled: true, firstname: "Test", lastname: "User With Editing permisions on a node", login: "apitestuserreader_1", salt: "225384010328",pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "apitestuser_1@thinksolid.com", permissions: [{nodeid : ObjectID("5261781556c02c072a000007"), role: "editor" },{nodeid : ObjectID("526d5179966a883540000006"), role: "none" }] },
            { _id: ObjectID("5261777656c02c072a000001"), role: "editor", enabled: true, firstname: "Test", lastname: "User", login: "apitestusereditor", salt: "225384010328",pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "apitestusereditor@thinksolid.com" },
            { _id: ObjectID("5261b811a94c1a971f000003"), role: "editor", enabled: true, firstname: "Test", lastname: "User", login: "apitestusereditor_restricted", salt: "225384010328",pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "apitestusereditor_1@thinksolid.com", permissions: [{nodeid : ObjectID("5261781556c02c072a000007"), role: "reader" },{nodeid : ObjectID("526d5179966a883540000006"), role: "none" }, {nodeid: ObjectID("5261777656c02c072a000001"), role: "none"}] },
            { _id: ObjectID("5245ce1d56c02c066b000001"), email: "apitestuser@thinksolid.com", login: "apitestuser", salt: "225384010328", pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", enabled: true, role: "reader", firstname: "Test", lastname: "User" }
        ],
        nodes = [
            { _id: ObjectID("5261781556c02c072a000007"), label: "Sample Node", slug: "/this/is/my/path", parent: null },
            { _id: ObjectID("526d5179966a883540000006"), label: "Locked Down Node", slug: "/this/is/my/restricted/path", parent: null },
            { _id: ObjectID("526417710658fc1f0a00000b"), label: "Sample  Sub-Node", slug: "sample_sub_node", parent: ObjectID("5261781556c02c072a000007") },
            { _id: ObjectID("5246e73d56c02c0744000001"), label: "Sample  Sub-Node 2", slug: "sample_sub_node2", parent: ObjectID("5261781556c02c072a000007") },
            { _id: ObjectID("5246e80c56c02c0744000002"), label: "Sample  Sub-Node 3", slug: "sample_sub_node3", parent: ObjectID("5261781556c02c072a000007") },
            { _id: ObjectID("52619b3dabc0ca310d000003"), label: "Sample  Sub-Node 4", slug: "sample_sub_node4", parent: ObjectID("5261781556c02c072a000007") },
            { _id: ObjectID("5261777656c02c072a000001"), label: "Sample  Sub-Node 5", slug: "sample_sub_node5", parent: ObjectID("5261781556c02c072a000007") },
            { _id: ObjectID("5261b811a94c1a971f000003"), label: "Sample  Sub-Node 6", slug: "sample_sub_node6", parent: ObjectID("5261781556c02c072a000007") },
            { _id: ObjectID("5245ce1d56c02c066b000001"), label: "Sample  Sub-Node 7", slug: "sample_sub_node7", parent: ObjectID("5261781556c02c072a000007") },
            { _id: ObjectID("524362aa56c02c0703000001"), label: "Sample  Sub-Node 8", slug: "sample_sub_node8", parent: ObjectID("5261781556c02c072a000007") },
            { _id: ObjectID("5254908d56c02c076e000001"), label: "Sample  Sub-Node 9", slug: "sample_sub_node9", parent: ObjectID("5261781556c02c072a000007") },
            { _id: ObjectID("52712a3e2eacd5a714000002"), label: "Sample Sub Sub-Node 1", slug: "sample_sub_sub_node1", parent: ObjectID("5254908d56c02c076e000001") },
            { _id: ObjectID("52712a3e2eacd5a714000001"), label: "Sample Sub Sub-Node 2", slug: "sample_sub_sub_node2", parent: ObjectID("524362aa56c02c0703000001") },
            { _id: ObjectID("52712a3e2eacd5a714000006"), label: "Sample Sub Sub-Node 3", slug: "sample_sub_sub_node3", parent: ObjectID("524362aa56c02c0703000001") }
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
        content = [];

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

    function importHookEvents(col, callback){
        importData('hookevents', col, callback);
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
            },
            function(callback){
                async.each(hookEvents, importContent, function(err){
                    if(err){ grunt.log.error(err); }

                    grunt.log.writeln("Test `hookevents` imported.");
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
