/*global require*/
// Require.js allows us to configure shortcut alias
require.config({
    baseUrl : '/admin/',
    shim : {
        base64 : {
            exports : 'Base64'
        },
        alerts : {
            deps : ['foundation']
        },
        dropdown : {
            deps : ['foundation']
        },
        tabs : {
            deps : ['foundation']
        },
        tooltip : {
            deps : ['foundation']
        },
        abide : {
            deps : ['foundation']
        },
        foundation : {
            exports : 'Foundation',
            deps : ['jquery']
        },
        jqueryui : {
            exports : 'jquery',
            deps : ['jquery']
        },
        select2 : {
            exports : 'jquery',
            deps : ['jquery']
        },
        widgetFactory : {
            exports : 'jquery',
            deps : ['jqueryui']
        },
        mouseInteraction : {
            exports : 'jquery',
            deps : ['jqueryui', 'widgetFactory']
        },
        sortable : {
            exports : 'jquery',
            deps : ['jqueryui', 'widgetFactory', 'mouseInteraction']
        },
        accordion : {
            exports : 'jquery',
            deps : ['jqueryui', 'widgetFactory']
        },
        ckeditorAdapter : {
            exports : 'jquery',
            deps : ['jquery', 'ckeditor']
        },
        scrollToFixed : {
            exports : 'jquery',
            deps : ['jquery']
        },
        datetimepicker : {
            exports : 'datetimepicker',
            deps : ['jquery']
        },
        velocity : {
            deps : ['jquery']
        },
        multipleSelect : {
            deps : ['jquery']
        },
        momentTimezoneWithData : {
            deps : ['moment'],
            exports : 'moment'
        }
    },
    packages : [
        {
            name : 'underscore',
            location : 'vendor/lodash-amd/underscore'
        },
        {
            name : 'masseuse',
            location : 'vendor/masseuse/app'
        },
        {
            name : 'helpers',
            location : 'helpers'
        }
    ],
    paths : {
        "jquery" : "vendor/jquery/dist/jquery",
        "jqueryui" : "vendor/jquery.ui/ui/jquery.ui.core",
        "select2" : "vendor/select2/select2",
        "backbone" : "vendor/backbone-amd/backbone",
        "text" : "vendor/requirejs-text/text",
        "rivets" : "vendor/rivets/dist/rivets",
        "base64" : "vendor/js-base64/base64",
        "foundation" : "vendor/foundation/js/foundation/foundation",
        "modernizr" : "vendor/modernizr/modernizr",
        "ckeditor" : "vendor/ckeditor/ckeditor",
        "ckeditorAdapter" : "vendor/ckeditor/adapters/jquery",
        "ace" : "vendor/ace/lib/ace",
        "moment" : "vendor/moment/moment",
        "momentTimezoneWithData" : "vendor/moment-timezone/builds/moment-timezone-with-data",
        "scrollToFixed" : "vendor/ScrollToFixed/jquery-scrolltofixed",
        "datetimepicker" : "vendor/datetimepicker/jquery.datetimepicker",
        "sparkmd5" : "vendor/SparkMD5/spark-md5",
        "JSONEditor" : "vendor/jsoneditor/jsoneditor",
        "contextjs" : "vendor/contextjs/context",
        "velocity" : "vendor/velocity/jquery.velocity",
        "mousetrap" : "vendor/mousetrap/mousetrap",
        "multipleSelect" : "vendor/multiple-select/jquery.multiple.select",
        "commaSeparatedValues" : "vendor/comma-separated-values/csv",
        "underscoreDeep" : "vendor/underscore.deep/main",

        "router" : "router",

        // "foundationDependencies"
        "alerts" : "vendor/foundation/js/foundation/foundation.alert",
        "dropdown" : "vendor/foundation/js/foundation/foundation.dropdown",
        "accordion" : "vendor/foundation/js/foundation/foundation.accordion",
        "tabs" : "vendor/foundation/js/foundation/foundation.tab",
        "tooltip" : "vendor/foundation/js/foundation/foundation.tooltip",
        "abide" : "vendor/foundation/js/foundation/foundation.abide",

        // "jqueryUIDependencies" : {
        "widgetFactory" : "vendor/jquery.ui/ui/jquery.ui.widget",
        "mouseInteraction" : "vendor/jquery.ui/ui/jquery.ui.mouse",
        "sortable" : "vendor/jquery.ui/ui/jquery.ui.sortable",
        "accordion" : "vendor/jquery.ui/ui/jquery.ui.accordion",

        // validation
        "validationLibrary" : "validation/validationLibrary",
        "validationTypes" : "validation/validationTypes",
        "validationAlpha" : "validation/views/alpha/view",
        "validationAlphaConfig" : "validation/views/alpha/config",
        "validationAlphaModel" : "validation/views/alpha/model",
        "validationNumber" : "validation/views/number/view",
        "validationNumberConfig" : "validation/views/number/config",
        "validationNumberModel" : "validation/views/number/model",
        "validationAlphaNumeric" : "validation/views/alphaNumeric/view",
        "validationAlphaNumericConfig" : "validation/views/alphaNumeric/config",
        "validationAlphaNumericModel" : "validation/views/alphaNumeric/model",

        "validationDate" : "validation/views/date/view",
        "validationDateConfig" : "validation/views/date/config",
        "validationDateModel" : "validation/views/date/model",
        "validationDateFormatters" : "validation/views/date/formatters",
        "validationDatetime" : "validation/views/datetime/view",
        "validationDatetimeConfig" : "validation/views/datetime/config",
        "validationDatetimeModel" : "validation/views/datetime/model",
        "validationDatetimeFormatters" : "validation/views/datetime/formatters",
        "validationEmail" : "validation/views/email/view",
        "validationEmailConfig" : "validation/views/email/config",
        "validationEmailModel" : "validation/views/email/model",
        "validationRegex" : "validation/views/regex/view",
        "validationRegexConfig" : "validation/views/regex/config",
        "validationRegexModel" : "validation/views/regex/model",
        "validationUrl" : "validation/views/url/view",
        "validationUrlConfig" : "validation/views/url/config",
        "validationUrlModel" : "validation/views/url/model",
        "validationRequired" : "validation/views/required/view",
        "validationRequiredConfig" : "validation/views/required/config",
        "validationRequiredModel" : "validation/views/required/model",

        "mixins" : "mixins",

        // "views" : {
        "grasshopperBaseView" : "views/grasshopperBaseView",

        "pluginBaseView" : "views/pluginBaseView",

        "advancedSearch" : "views/advancedSearch",

        "addAssetsView" : "views/addAssets/addAssetsView",
        "addAssetsViewConfig" : "views/addAssets/addAssetsViewConfig",
        "addAssetsViewModel" : "views/addAssets/addAssetsViewModel",

        "addContentView" : "views/addContent/addContentView",
        "addContentViewConfig" : "views/addContent/addContentViewConfig",
        "addContentViewModel" : "views/addContent/addContentViewModel",

        "addFolderView" : "views/addFolder/addFolderView",
        "addFolderViewConfig" : "views/addFolder/addFolderViewConfig",
        "addFolderViewModel" : "views/addFolder/addFolderViewModel",

        "addUser" : "views/addUser",

        "alertBoxView" : "views/alertBox/alertBoxView",
        "alertBoxViewConfig" : "views/alertBox/alertBoxViewConfig",
        "alertBoxViewModel" : "views/alertBox/alertBoxViewModel",

        "assetDetailView" : "views/assetDetail/assetDetailView",
        "assetDetailViewConfig" : "views/assetDetail/assetDetailViewConfig",
        "assetDetailViewModel" : "views/assetDetail/assetDetailViewModel",

        "contentBrowseView" : "views/contentBrowse/contentBrowseView",
        "contentBrowseViewConfig" : "views/contentBrowse/contentBrowseViewConfig",
        "contentBrowseViewModel" : "views/contentBrowse/contentBrowseViewModel",
        "contentBrowseViewChildNodesCollection" : "views/contentBrowse/childNodesCollection",
        "contentBrowseViewChildContentCollection" : "views/contentBrowse/childContentCollection",
        "contentBrowseViewChildAssetsCollection" : "views/contentBrowse/childAssetsCollection",

        "contentDetailView" : "views/contentDetail/contentDetailView",
        "contentDetailViewConfig" : "views/contentDetail/contentDetailViewConfig",
        "contentDetailViewModel" : "views/contentDetail/contentDetailViewModel",

        "contentDetailRowView" : "views/contentDetail/contentDetailRow/view",
        "contentDetailRowViewConfig" : "views/contentDetail/contentDetailRow/config",
        "contentDetailRowViewModel" : "views/contentDetail/contentDetailRow/model",

        "contentTypeDetailView" : "views/contentTypeDetail/contentTypeDetailView",
        "contentTypeDetailViewConfig" : "views/contentTypeDetail/contentTypeDetailViewConfig",
        "contentTypeDetailViewModel" : "views/contentTypeDetail/contentTypeDetailViewModel",
        "contentTypeDetailViewFieldsCollection" : "views/contentTypeDetail/contentTypeDetailViewFieldsCollection",

        "contentTypeDetailRow" : "views/contentTypeDetail/contentTypeDetailRow/view",
        "contentTypeDetailRowConfig" : "views/contentTypeDetail/contentTypeDetailRow/config",
        "contentTypeDetailRowModel" : "views/contentTypeDetail/contentTypeDetailRow/model",

        "contentTypeIndexView" : "views/contentTypeIndex/contentTypeIndexView",
        "contentTypeIndexViewConfig" : "views/contentTypeIndex/contentTypeIndexViewConfig",
        "contentTypeIndexViewModel" : "views/contentTypeIndex/contentTypeIndexViewModel",
        "contentTypeIndexViewContentTypesCollection" : "views/contentTypeIndex/contentTypesCollection",

        "fieldAccordionView" : "views/contentTypeDetail/fieldAccordion/view",
        "fieldAccordionConfig" : "views/contentTypeDetail/fieldAccordion/config",
        "fieldAccordionModel" : "views/contentTypeDetail/fieldAccordion/model",
        "fieldAccordionBinders" : "views/contentTypeDetail/fieldAccordion/binders",
        "fieldAccordionValidationCollection" : "views/contentTypeDetail/fieldAccordion/validationCollection",

        "fileBrowserView" : "views/fileBrowser/fileBrowserView",
        "fileBrowserViewConfig" : "views/fileBrowser/fileBrowserViewConfig",
        "fileBrowserViewModel" : "views/fileBrowser/fileBrowserViewModel",

        "headerView" : "views/header/headerView",
        "headerViewConfig" : "views/header/headerViewConfig",
        "headerViewModel" : "views/header/headerViewModel",

        "itemSelectModal" : "views/itemSelectModal",

        "login" : "views/login",

        "mastheadView" : "views/masthead/mastheadView",
        "mastheadViewConfig" : "views/masthead/mastheadViewConfig",
        "mastheadViewModel" : "views/masthead/mastheadViewModel",
        "mastheadViewBinders" : "views/masthead/binders",

        "modalView" : "views/modal/modalView",
        "modalViewConfig" : "views/modal/modalViewConfig",
        "modalViewModel" : "views/modal/modalViewModel",
        "modalViewBinders" : "views/modal/binders",
        "modalViewFormatters" : "views/modal/formatters",

        "nodeDetailView" : "views/nodeDetail/nodeDetailView",
        "nodeDetailViewConfig" : "views/nodeDetail/nodeDetailViewConfig",
        "nodeDetailViewModel" : "views/nodeDetail/nodeDetailViewModel",

        "pagination" : "views/pagination",

        "pluginWrapperView" : "views/pluginWrapper/pluginWrapperView",
        "pluginWrapperViewConfig" : "views/pluginWrapper/pluginWrapperViewConfig",
        "pluginWrapperViewModel" : "views/pluginWrapper/pluginWrapperViewModel",
        "pluginWrapperViewCollection" : "views/pluginWrapper/pluginCollection",

        "userDetail" : "views/userDetail",

        "userDetailRow" : "views/userDetail/userDetailRow",

        "userIndexView" : "views/userIndex/userIndexView",
        "userIndexViewConfig" : "views/userIndex/userIndexViewConfig",
        "userIndexViewModel" : "views/userIndex/userIndexViewModel",
        "userIndexViewUsersCollection" : "views/userIndex/usersCollection",

        "forbiddenView" : "views/forbidden/forbiddenView",
        "forbiddenViewConfig" : "views/forbidden/forbiddenViewConfig",

        "notFoundView" : "views/notFound/notFoundView",
        "notFoundViewConfig" : "views/notFound/notFoundViewConfig",

        "infoView" : "views/info/infoView",
        "infoViewConfig" : "views/info/infoViewConfig",

        "helpView" : "views/help",

        // "models" : {
        "UserModel" : "models/userModel",
        "grasshopperModel" : "models/grasshopperModel",
        "pluginSetupModel" : "views/contentTypeDetail/pluginSetupModel",
        "currentUserInstance" : "models/currentUserInstance",

        // "workers" : {
        "loginWorker" : "workers/loginWorker",
        "logoutWorker" : "workers/logoutWorker",
        "contentTypeWorker" : "workers/contentTypeWorker",
        "ajaxCounterWorker" : "workers/ajaxCounterWorker",
        "clipboardWorker" : "workers/clipboardWorker",
        "assetWorker" : "workers/assetWorker",
        "breadcrumbWorker" : "workers/breadcrumbWorker",
        "nodeWorker" : "workers/nodeWorker",
        "urlWorker" : "workers/urlWorker",
        "paginationWorker" : "workers/paginationWorker",
        "searchWorker" : "workers/searchWorker",

        "grasshopperCollection" : "collections/grasshopperCollection",
        "paginatedCollection" : "collections/paginatedCollection",
        "searchCollection" : "collections/searchCollection",

        "api" : "api/api",

        "plugins" : "plugins",

        "appBinders" : "appBinders",
        "pluginWrapperBinders" : "views/pluginWrapper/pluginWrapperBinders",
        "contentTypeDetailBinders" : "views/contentTypeDetail/contentTypeDetailBinders",

        "formatters" : "formatters",
        "contentTypeDetailFormatters" : "views/contentTypeDetail/contentTypeDetailFormatters",

        "resources" : "resources",
        "constants" : "constants"
    }
});

require([
    'backbone',
    'underscore',
    'jquery',
    'router',
    'resources',
    'ajaxCounterWorker',
    'underscoreDeep',
    'contentDetailView',
    'require',
    'alerts',
    'dropdown',
    'tabs',
    'tooltip',
    'abide',
    'modernizr',
    'sortable',
    'accordion',
    'scrollToFixed',
    'select2',
    'sparkmd5',
    'contextjs',
    'velocity',
    'multipleSelect',
    'momentTimezoneWithData'
],
    /**
     * @param $
     * @param {Router} Router
     */
        function (Backbone, _, $, Router, resources, ajaxCounterWorker, underscoreDeep, contentDetailView) {
        'use strict';

        var router = new Router();

        _.templateSettings = {
            evaluate : /\[\[(.+?)\]\]/g,
            interpolate : /\[\[=(.+?)\]\]/g,
            escape : /\[\[-(.+?)\]\]/g
        };

        _.mixin(underscoreDeep);

        ajaxCounterWorker.setupCounter();

        // TODO: For some reason this is not needed?
        $(document).foundation();

        if(window.dontStartOldAdmin) {
            router.beforeRouting();
        } else {
            Backbone.history.start({
                hashChange : false,
                pushState: false,
                root: '/admin'
            });
        }

        window.gh.oldAdmin = {
            ContentDetailView : contentDetailView
        };

        console.log('OLD ADMIN READY FIRED FROM THE OLD ADMIN');
        $(document.body).trigger('oldadminready', {});

        // $(document).on('click', 'a:not([data-bypass])', function (evt) {
        //     var href = $(this).attr('href') || '',
        //      protocol = this.protocol + '//',
        //      scriptCheck = this.protocol.slice(0, -1);
        //
        //     if (href && !/^http[s]?:\/\//.test(href) && href!='#' && href.slice(protocol.length) !== protocol && scriptCheck != 'javascript') {
        //         evt.preventDefault();
        //         router.navigate(href, {trigger:true});
        //     }
        // });
    });
