'use strict';

module.exports = {
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
};
