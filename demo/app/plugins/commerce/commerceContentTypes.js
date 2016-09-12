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
                "options" : "", // Set while Adding. The Content Type ID of the Commerce Product
                "type" : "embeddedtype",
                "validation" : [],
                "_id" : "products",
                "dataType" : "ref"
            }
        ]
    },
    commerceProduct : {
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
                "label" : "Product Content Type Id",
                "max" : 10,
                "min" : 0,
                "options" : "", // Set while Adding. The Content Type ID of the Commerce Product
                "type" : "string",
                "validation" : [],
                "_id" : "typeId",
                "dataType" : "string"
            }
        ]
    }
};
