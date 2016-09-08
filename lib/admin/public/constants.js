/*global define*/
define([], function() {
    'use strict';

    var ghaConfigs = window.gh.configs || {},
        apiEndpoint = ghaConfigs.apiEndpoint,
        version = ghaConfigs.version,
        libraryVersions = ghaConfigs.libraryVersions,
        typeSlugification = ghaConfigs.typeSlugification,
        homeString = ghaConfigs.homeString,
        archivedContentFieldName = ghaConfigs.archivedContentFieldName,
        timeZone = ghaConfigs.timeZone,
        base = ghaConfigs.base;

    return {
        version : version,
        libraryVersions: libraryVersions,
        menuItems : [],
        api : {
            base : {
                url : apiEndpoint
            },
            login : {
                url : apiEndpoint + '/token'
            },
            logout : {
                url : apiEndpoint + '/token/logout'
            },
            user : {
                url : apiEndpoint + '/user'
            },
            users : {
                url : apiEndpoint + '/users'
            },
            usersQuery : {
                url : apiEndpoint + '/users/query'
            },
            newUser : {
                url : apiEndpoint + '/users'
            },
            contentTypes : {
                url : apiEndpoint + '/contenttypes'
            },
            node : {
                url : apiEndpoint + '/node'
            },
            nodesChildren : {
                url : apiEndpoint + '/node/:id/children'
            },
            nodesChildrenDeep : {
                url : apiEndpoint + '/node/:id/children/deep'
            },
            nodesContent : {
                url : apiEndpoint + '/node/:id/content'
            },
            assets : {
                url : apiEndpoint + '/node/:id/assets'
            },
            nodesContentTypes : {
                url : apiEndpoint + '/node/:id/contenttype'
            },
            content : {
                url : apiEndpoint + '/content'
            },
            moveNode : {
                url : apiEndpoint + '/node/move'
            },
            copyAsset : {
                url : apiEndpoint + '/node/:id/assets/copy'
            },
            moveAsset : {
                url : apiEndpoint + '/node/:id/assets/move'
            },
            contentQuery : {
                url : apiEndpoint + '/content/query'
            },
            version : {
                url : apiEndpoint + '/system'
            },
            google : {
                url : apiEndpoint + '/googleurl'
            },
            unlinkGoogle : {
                url : apiEndpoint + '/users/:id/unlink'
            }
        },
        internalRoutes : {
            advancedSearch : base + 'advanced-search',
            advancedSearchWithOptions : base + 'advanced-search/:type/query=:queryOptions',
            user : base + 'user',
            users : base + 'users',
            userDetail : base + 'user/:id',
            addUser : base + 'add-user',
            info: 'base + /nfo',
            contentTypes : base + 'content-types',
            newContentType : base + 'content-types/new',
            contentTypeDetail : base + 'content-types/:id',
            content : base + 'items',
            contentDetail : base + 'item/:id',
            nodeDetail : base + 'items/nodeid/:id',
            login : base + 'login',
            logout : base + 'logout',
            about : base + 'about',
            help : base + 'help',
            createFolder : base + 'items/nodeid/:id/create-folder',
            addContent : base + 'items/nodeid/:id/create-content',
            createAssets : base + 'items/nodeid/:id/create-assets',
            forbidden : base + 'forbidden',
            notFound : base + 'not-found'
        },
        timeouts: {
            showSpinnerLoadingTimeout: 2000
        },
        fileExtensionsMap : {
            pdf : 'fa-file-pdf-o',
            doc : 'fa-file-word-o',
            docx : 'fa-file-word-o',
            xsl : 'fa-file-excel-o',
            xslx : 'fa-file-excel-o',
            txt : 'fa-file-text',
            zip : 'fa-file-archive-o',
            psd : 'fa-file-image-o',
            ai : 'fa-file-image-o',
            swf : 'fa-file-video-o'
        },
        imageExtensions : [
            'jpg',
            'jpeg',
            'png',
            'bmp',
            'webp',
            'svg',
            'gif'
        ],
        contentSearchThrottle: 1000,
        pagination : {
            defaultLimit : 500,
            defaultSkip : 1,
            defaultPagesLimit : 7,
            defaultPageSize : [
                1000,
                2000,
                'all'
            ],
            defaultAllLimit : 100000
        },
        controlKeyCodeMap : {
            13 : 'enter',
            16 : 'shift',
            17 : 'cntrl',
            18 : 'alt',
            20 : 'capsLock',
            27 : 'esc',
            37 : 'lArr',
            38 : 'tArr',
            39 : 'rArr',
            40 : 'bArr',
            91 : 'leftCMD',
            93 : 'rightCMD'
        }, // https://github.com/josdejong/jsoneditor/blob/master/docs/api.md
        jsoneditor : {
            mode: 'tree',
            modes:['code', 'tree']
        },
        loginRedirectKey : 'loginRedirect',
        profileGoogleLinkRedirect : {
            url : '/user/:id'
        },
        contextConfig : {
            preventDoubleContext: true,
            compress: true
        },
        defaultPageTransitions : {
            enter : {
                type : 'fadeIn',
                options : {
                    duration : 100
                }
            }
        },
        possibleQueryComparators : [
            'equals',
            'notequals',
            '>=',
            '>',
            '<=',
            '<',
            'in',
            'contains',
            '!in',
            'notin',
            'notcontains',
            'like',
            'notlike',
            'between',
            'notbetween',
            'size',
            'exists'
        ],
        typeSlugification : typeSlugification,
        home : homeString,
        archivedContentFieldName : archivedContentFieldName,
        timeZone : timeZone
    };
});