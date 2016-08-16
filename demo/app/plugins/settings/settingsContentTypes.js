'use strict';

module.exports = {
    plugins : {
        label: 'Plugins',
        helpText: 'The available Plugins',
        fields:  [
            {
                "label" : "Title",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "textbox",
                "validation" : [],
                "_id" : "title",
                "defaultValue" : "",
                "dataType" : "string"
            },
            {
                "label" : "Active",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "boolean",
                "validation" : [],
                "_id" : "active",
                "dataType" : "boolean"
            },
            {
                "label" : "Version",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "textbox",
                "validation" : [],
                "_id" : "version",
                "defaultValue" : "",
                "dataType" : "string"
            },
            {
                "label" : "Description",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "textbox",
                "validation" : [],
                "_id" : "description",
                "defaultValue" : "",
                "dataType" : "string"
            },
            {
                "label" : "Directory",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "textbox",
                "validation" : [],
                "_id" : "directory",
                "defaultValue" : "",
                "dataType" : "string"
            }
        ]
    },
    tabs : {
        label: 'Tabs',
        helpText: 'The available Tabs',
        fields:  [
            {
                "label" : "Title",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "textbox",
                "validation" : [],
                "_id" : "title",
                "defaultValue" : "",
                "dataType" : "string"
            },
            {
                "label" : "Active",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "boolean",
                "validation" : [],
                "_id" : "active",
                "dataType" : "boolean"
            },
            {
                "label" : "Href",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "textbox",
                "validation" : [],
                "_id" : "href",
                "defaultValue" : "",
                "dataType" : "string"
            },
            {
                "label" : "Icon Classes",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "textbox",
                "validation" : [],
                "_id" : "iconclasses",
                "defaultValue" : "",
                "dataType" : "string"
            },
            {
                "label" : "Roles",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "textbox",
                "validation" : [],
                "_id" : "roles",
                "defaultValue" : "admin reader editor",
                "dataType" : "string"
            },
            {
                "label" : "Added By",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "textbox",
                "validation" : [],
                "_id" : "addedby",
                "defaultValue" : "",
                "dataType" : "string"
            },
            {
                "label" : "Sort",
                "max" : 1,
                "min" : 1,
                "options" : false,
                "type" : "textbox",
                "validation" : [],
                "_id" : "sort",
                "defaultValue" : "",
                "dataType" : "string"
            }
        ]
    }
};


