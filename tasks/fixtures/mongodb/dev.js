(function(){
    "use strict";

    var data = {},
        ObjectID = require('mongodb').ObjectID;

    data.hookEvents = [
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
    ]

    data.users = [
        { _id: ObjectID("5246e73d56c02c0744000004"), role: "admin",enabled: true, firstname: "Test", lastname: "User", login: "admin", salt: "225384010328", pass_hash: "885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03", email: "admin@thinksolid.com" }
    ];

    data.nodes = [
        { _id: ObjectID("5261781556c02c072a000007"), label: "Help", parent: null },
        { _id: ObjectID("526d5179966a883540000006"), label: "Lessons", parent: null },
        { _id: ObjectID("526417710658fc1f0a00000b"), label: "What is grasshopper?", parent: ObjectID("526d5179966a883540000006"), ancestors: [ObjectID("526d5179966a883540000006")] },
        { _id: ObjectID("5246e73d56c02c0744000001"), label: "Working with the API", parent: ObjectID("526d5179966a883540000006"), ancestors: [ObjectID("526d5179966a883540000006")] },
        { _id: ObjectID("5246e80c56c02c0744000002"), label: "Building applications", parent: ObjectID("526d5179966a883540000006"),ancestors: [ObjectID("526d5179966a883540000006")] },
        { _id: ObjectID("52619b3dabc0ca310d000003"), label: "Blog",  parent: null },
        { _id: ObjectID("5261777656c02c072a000001"), label: "Static Content",  parent: null },
        { _id: ObjectID("5261b811a94c1a971f000003"), label: "Support", parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001")] },
        { _id: ObjectID("5245ce1d56c02c066b000001"), label: "Legal", parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001")] },
        { _id: ObjectID("524362aa56c02c0703000001"), label: "Admin", parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001"), ObjectID("5261b811a94c1a971f000003")] },
        { _id: ObjectID("5254908d56c02c076e000001"), label: "User", parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001"), ObjectID("5261b811a94c1a971f000003")] },
        { _id: ObjectID("52712a3e2eacd5a714000002"), label: "Developer",  parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001"), ObjectID("5261b811a94c1a971f000003")] }
    ];

    data.contentTypes = [
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

    ];

    data.content = [
        {
            _id: ObjectID("5261781556c02c072a000007"),label:"Sample content title", slug: 'sample_content_title', type: ObjectID("524362aa56c02c0703000001"), nonce:"1234565", status: "Live", node : {_id: ObjectID("5261781556c02c072a000007"), displayOrder: 1}, fields: {testfield: "test value"}, author: {_id: ObjectID("5246e73d56c02c0744000001"), name: "Test User"}
        },{
            _id: ObjectID("5254908d56c02c076e000001"),label:"Sample content title", slug: 'sample_confdstent_title', type: ObjectID("524362aa56c02c0703000001"), nonce:"1234fds565", status: "Live", node : {_id: ObjectID("5261781556c02c072a000007"), displayOrder: 1}, fields: {testfield: "test value"}, author: {_id: ObjectID("5246e73d56c02c0744000001"), name: "Test User"}
        }
    ];

    module.exports = data;
})();

