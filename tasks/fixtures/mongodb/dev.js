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
        { _id: ObjectID("52712a3e2eacd5a714000002"), label: "Developer",  parent: ObjectID("5261777656c02c072a000001"),ancestors: [ObjectID("5261777656c02c072a000001"), ObjectID("5261b811a94c1a971f000003")] },
        { _id: ObjectID("52cc627f69c89d8b1a000001"), allowedTypes: [ ObjectID("52cc57c556c02c14b1000001") ], ancestors: [], label: "Films", parent: null },
        { _id: ObjectID("52cc62b369c89d8b1a000002"), allowedTypes: [ ObjectID("524362aa56c02c0703000001") ], ancestors: [], label: "Static Content", parent: null },
        {
            label: "Nested Film",
            _id: ObjectID("52f979d3357ff70507000005"),
            allowedTypes: [ ObjectID("52cc57c556c02c14b1000001") ],
            parent: ObjectID("52cc627f69c89d8b1a000001"),
            ancestors: [ ObjectID("52cc627f69c89d8b1a000001") ],
            __v: 0
        }
    ];

    data.contentTypes = [
        {
            _id: ObjectID("524362aa56c02c0703000001"),
            label: "This is my test content type",
            helpText: "",
            meta: [],
            description: "",
            fields: [
                {
                    _id: "testfield",
                    required: true,
                    min: 1,
                    max: 1,
                    type: "textbox",
                    label: "Title",
                    useAsLabel : true
                }
            ]
        },
        {
            _id: ObjectID("5254908d56c02c076e000001"),
            label: "Users",
            description: "Protected content type that defines users in the system.",
            helpText: "These fields are the min required to create a user in the system. See more about extending users through plugins.",
            fields: [
                {
                    _id : "login",
                    required: true,
                    min: 1,
                    max: 1,
                    label: "Login",
                    type: "textbox",
                    useAsLabel : true
                },
                {
                    _id : "name",
                    required: true,
                    min: 1,
                    max: 1,
                    label: "Name",
                    type: "textbox",
                    useAsLabel : false
                },
                {
                    _id : "email",
                    required: true,
                    min: 1,
                    max: 1,
                    label: "Email",
                    type: "textbox",
                    useAsLabel : false
                },
                {
                    _id : "role",
                    required: true,
                    min: 1,
                    max: 1,
                    label: "Role",
                    type: "dropdown",
                    options: [
                        {
                            label: "Reader",
                            _id: "reader"
                        },
                        {
                            label: "Author",
                            _id: "author"
                        },
                        {
                            label: "Editor",
                            _id: "editor"
                        },
                        {
                            label: "Admin",
                            _id: "admin"
                        },
                        {
                            label: "None",
                            _id: "none"
                        }
                    ],
                    useAsLabel : false
                },
                {
                    _id : "password",
                    required: true,
                    min: 1,
                    max: 1,
                    label: "Password",
                    type: "password",
                    useAsLabel : false
                },
                {
                    _id : "enabled",
                    required: true,
                    min: 1,
                    max: 1,
                    label: "Enabled",
                    type: "radio",
                    useAsLabel : false
                }
            ],
            meta: [],
            "protected": true
        },
        {
            _id: ObjectID("52cc57c556c02c14b1000001"),
            label: "Film",
            description: "",
            helpText: "",
            fields: [
                {
                    _id: "title",
                    type: "textbox",
                    required: true,
                    label: "Title",
                    min: 1,
                    max: 1,
                    useAsLabel : true
                },
                {
                    _id: "shortsummary",
                    min: 1,
                    max: 1,
                    type: "textarea",
                    required: false,
                    label: "Short Summary",
                    useAsLabel : false
                },
                {
                    _id: "fullsummary",
                    min: 1,
                    max: 1,
                    type: "textarea",
                    required: false,
                    label: "Full Summary",
                    useAsLabel : false
                },
                {
                    _id: "categories",
                    options: [
                        {
                            _id: "kids",
                            label: "Kids"
                        },
                        {
                            _id: "indie",
                            label: "Inide"
                        },
                        {
                            _id: "stuffWithExplosions",
                            label: "Stuff With Explosions"
                        }
                    ],
                    type: "dropdown",
                    min: 1,
                    max: 3,
                    label: "Categories",
                    useAsLabel : false
                },
                {
                    _id: "partnerid",
                    type: "readonly",
                    min: 1,
                    max: 1,
                    required: false,
                    label: "Partner ID",
                    useAsLabel : false
                },
                {
                    _id: "badges",
                    type: "textbox",
                    min: 1,
                    max: 10,
                    label: "Badges",
                    useAsLabel : false
                },
                {
                    _id: "genres",
                    type: "textbox",
                    min: 1,
                    max: 3,
                    label: "Genres",
                    useAsLabel : false
                },
                {
                    _id: "tags",
                    type: "textbox",
                    min: 1,
                    max: 10,
                    label: "Tags",
                    useAsLabel : false
                },
                {
                    _id: "region",
                    type: "readonly",
                    min: 1,
                    max: 1,
                    label: "Region",
                    useAsLabel : false
                },
                {
                    _id: "worktype",
                    type: "readonly",
                    min: 1,
                    max: 1,
                    label: "Work Type",
                    useAsLabel : false
                },
                {
                    _id: "releaseyear",
                    type: "readonly",
                    min: 1,
                    max: 1,
                    label: "Release Year",
                    useAsLabel : false
                },
                {
                    _id: "runlength",
                    type: "readonly",
                    min: 1,
                    max: 1,
                    label: "Run Length",
                    useAsLabel : false
                },
                {
                    _id: "ratings",
                    type: "embeddedtype",
                    min: 1,
                    max: 1,
                    options: "52cc5d2756c02c14b1000002",
                    label: "Ratings",
                    useAsLabel : false
                },
                {
                    _id: "countryoforigin",
                    type: "readonly",
                    min: 1,
                    max: 1,
                    label: "Country of Origin",
                    useAsLabel : false
                },
                {
                    _id: "actors",
                    type: "readonly",
                    min: 1,
                    max: 1,
                    label: "Actors",
                    useAsLabel : false
                },
                {
                    _id: "directors",
                    type: "readonly",
                    min: 1,
                    max: 1,
                    label: "Directors",
                    useAsLabel : false
                },
                {
                    _id: "producers",
                    type: "readonly",
                    min: 1,
                    max: 1,
                    label: "Producers",
                    useAsLabel : false
                },
                {
                    _id: "studio",
                    type: "readonly",
                    min: 1,
                    max: 1,
                    label: "Studio",
                    useAsLabel : false
                },
                {
                    _id: "availability",
                    type: "embeddedtype",
                    min: 1,
                    max: 1,
                    options: "52cc5eb856c02c14b1000003",
                    label: "Availability",
                    useAsLabel : false
                },
                {
                    _id: "trailers",
                    type: "embeddedtype",
                    min: 1,
                    max: 1,
                    options: "52cc602156c02c14b1000004",
                    label: "Trailers",
                    useAsLabel : false
                },
                {
                    _id: "digitalassets",
                    type: "embeddedtype",
                    min: 1,
                    max: 1,
                    options: "52cc602156c02c14b1000004",
                    label: "Digital Assets",
                    useAsLabel : false
                },
                {
                    _id: "images",
                    type: "embeddedtype",
                    min: 1,
                    max: 1,
                    options: "52cc621956c02c14b1000005",
                    label: "Images",
                    useAsLabel : false
                }
            ]
        },
        {
            label: "Ratings",
            _id: ObjectID("52cc5d2756c02c14b1000002"),
            fields: [
                {
                    type: "textbox",
                    _id: "title",
                    min: 1,
                    max: 1,
                    label: "Title",
                    useAsLabel : true
                },
                {
                    type: "textbox",
                    _id: "region",
                    min: 1,
                    max: 1,
                    label: "Region",
                    useAsLabel : false
                },
                {
                    type: "textbox",
                    _id: "system",
                    min: 1,
                    max: 1,
                    label: "System",
                    useAsLabel : false
                }
            ],
            "protected": false,
            description: "",
            helpText: ""
        },
        {
            label: "Availability",
            _id: ObjectID("52cc5eb856c02c14b1000003"),
            fields: [
                {
                    type: "readonly",
                    _id: "licensetype",
                    min: 1,
                    max: 1,
                    label: "License Type",
                    useAsLabel : true
                },
                {
                    type: "readonly",
                    _id: "start",
                    min: 1,
                    max: 1,
                    label: "Start",
                    useAsLabel : false
                },
                {
                    type: "readonly",
                    _id: "end",
                    min: 1,
                    max: 1,
                    label: "End",
                    useAsLabel : false
                }
            ],
            "protected": false,
            description: "",
            helpText: ""
        },
        {
            label: "Digital Assets",
            _id: ObjectID("52cc602156c02c14b1000004"),
            fields: [
                {
                    type: "readonly",
                    _id: "assetid",
                    min: 1,
                    max: 1,
                    label: "Asset ID",
                    useAsLabel : true
                },
                {
                    type: "readonly",
                    _id: "url",
                    min: 1,
                    max: 1,
                    label: "URL",
                    useAsLabel : false
                },
                {
                    type: "readonly",
                    _id: "height",
                    min: 1,
                    max: 1,
                    label: "Height",
                    useAsLabel : false
                },
                {
                    type: "readonly",
                    _id: "width",
                    min: 1,
                    max: 1,
                    label: "Width",
                    useAsLabel : false
                },
                {
                    type: "readonly",
                    _id: "aspectratio",
                    min: 1,
                    max: 1,
                    label: "Aspect Ratio",
                    useAsLabel : false
                },
                {
                    type: "readonly",
                    _id: "drmtype",
                    min: 1,
                    max: 1,
                    label: "DRM Type",
                    useAsLabel : false
                },
                {
                    type: "readonly",
                    _id: "audioprofile",
                    min: 1,
                    max: 1,
                    label: "Audio Profile",
                    useAsLabel : false
                },
                {
                    type: "readonly",
                    min: 1,
                    max: 1,
                    _id: "encodingprofile",
                    label: "Encoding Profile",
                    useAsLabel : false
                }
            ],
            "protected": false,
            description: "",
            helpText: ""
        },
        {
            label: "Image Assets",
            _id: ObjectID("52cc621956c02c14b1000005"),
            fields: [
                {
                    type: "readonly",
                    _id: "url",
                    min: 1,
                    max: 1,
                    label: "URL",
                    useAsLabel : true
                },
                {
                    type: "readonly",
                    _id: "size",
                    min: 1,
                    max: 1,
                    label: "Size",
                    useAsLabel : false
                },
                {
                    type: "readonly",
                    _id: "height",
                    min: 1,
                    max: 1,
                    label: "Height",
                    useAsLabel : false
                },
                {
                    type: "readonly",
                    _id: "width",
                    min: 1,
                    max: 1,
                    label: "Width",
                    useAsLabel : false
                }
            ],
            "protected": false,
            description: "",
            helpText: ""
        }

    ];

    data.content = [
        {
            _id: ObjectID("5261781556c02c072a000007"),
            label:"Sample content title",
            slug: 'sample_content_title',
            type: ObjectID("524362aa56c02c0703000001"),
            nonce:"1234565",
            status: "Live",
            node : {
                _id: ObjectID("5261781556c02c072a000007"),
                displayOrder: 1
            },
            fields: {
                testfield: "test value"
            },
            author: {
                _id: ObjectID("5246e73d56c02c0744000001"),
                name: "Test User"
            }
        },{
            _id: ObjectID("5254908d56c02c076e000001"),
            label:"Sample content title",
            slug: 'sample_confdstent_title',
            type: ObjectID("524362aa56c02c0703000001"),
            nonce:"1234fds565",
            status: "Live",
            node : {
                _id: ObjectID("5261781556c02c072a000007"),
                displayOrder: 1
            },
            fields: {
                testfield: "test value"
            },
            author: {
                _id: ObjectID("5246e73d56c02c0744000001"),
                name: "Test User"
            }
        },
        {
            _id: ObjectID("52cf349456c02c0722000001"),
            node: {
                _id: ObjectID("52cc627f69c89d8b1a000001"),
                displayOrder: 1
            },
            author: {
                _id: ObjectID("5246e73d56c02c0744000001"),
                firstname: "Test",
                fullname: "Test User",
                lastname: "User"
            },
            type: ObjectID("52cc57c556c02c14b1000001"),
            status: "Live",
            label: "Dune by Frank Herbet",
            nonce: "1234fdsdfsa565",
            slug: "generated_title",
            fields: {
                runlength: "test runlength",
                region: "test region",
                partnerid: "test partnerid",
                trailers: "test trailers",
                releaseyear: "test releaseyear",
                badges: [
                    "test badge 1",
                    "test badge 2"
                ],
                studio: "test studio",
                availability: "test availability",
                fullsummary: "text fullsummary",
                ratings: [
                    {
                        title: "RATED R",
                        system: "AMERICAN",
                        region: "Regions apon regions"
                    },
                    {
                        title: "RATED Z",
                        system: "EUROPEAN",
                        region: "Regions apon regions"
                    },
                    {
                        title: "RATED Q",
                        system: "SOLID RATINGS",
                        region: "Regions apon regions"
                    }
                ],
                categories: [
                    "kids",
                    "indie"
                ],
                shortsummary: "test shortsummary",
                countryoforigin: "test countryoforigin",
                directors: "test directors",
                digitalassets: "test digitalassets",
                worktype: "test worktype",
                actors: [
                    "test actor 1",
                    "test actor 2"
                ],
                title: "test title",
                images: "images",
                genres: "test genres",
                producers: "test producers",
                tags: "test tags"
            }
        }
    ];

    module.exports = data;
})();