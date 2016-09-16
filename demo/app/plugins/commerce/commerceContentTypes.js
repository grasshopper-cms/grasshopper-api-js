'use strict';

module.exports = {
    options : {
        label: 'Commerce Options',
        helpText: 'Commerce Options',
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
                "label" : "Products",
                "max" : 10,
                "min" : 0,
                "options" : "",
                "type" : "array",
                "validation" : [],
                "_id" : "products",
                "dataType" : "array"
            }
        ]
    },
    productContentTypeTemplate : {
        label: 'Commerce Product',
        helpText: 'A commerce product.',
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
                "label" : "Sku",
                "max" : 10,
                "min" : 0,
                "options" : "",
                "type" : "string",
                "validation" : [],
                "_id" : "sku",
                "dataType" : "string"
            }
        ]
    }
};
