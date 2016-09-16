product-content-types
    h3(show='{ model.showProductTypeList }') Active Product Types
    .columns(show='{ model.showProductTypeList }')
        virtual(each='{ product in model.commerceOptions.fields.products }')
            .column.one-half { product }
            .column.one-half
                button.btn.right(type='button') Edit

        .column.four-fifths.centered.blankslate(if='{ model.commerceOptions.fields.products.length === 0 }')
            h3 No Active Product Types. 
            p Add one below.
    .add-product-type(show='{ model.showAbilityToAddProduct }')
        button.btn.right(type='button' onclick='{ toggleAddNewProductType }') Add Product Type

    .content-types-selection-container(show='{ model.showContentTypesSelection }')
        h3 Select Existing Content Type
        .columns.possible-content-type(each='{ contentType in model.contentTypes }')
            .column.four-fifths { contentType.label }
            .column.one-fifth 
                button.btn.right(type='button' onclick='{ selectExistingContentType }') Add
        h3 Add Product Type Template
        .columns.add-new-content-type
            .column.four-fifths Add Product Type Template
            .column.one-fifth
                button.btn.right(type='button' onclick='{ addProductTypeTemplate }') Add Template
        button.btn.btn-danger.right(type='button' onclick='{ cancelContentTypeSelection }') Cancel
        
    .content-type-template-get-name-container(show='{ model.showContentTypeTemplate }')
        h3 Name Your New Content Type
        .columns
            .column.one-half Name your content type
            .column.one-half
                input(type='text' name='customProductTypeInput')
        button.btn.btn-danger.right(type='button' onclick='{ cancelContentTypeSelection }') Cancel
        button.btn.right(type='button' onclick='{ addThisNewTemplateType }') Save

    script.
        var request = require('superagent'),
            path = require('path'),
            BB = require('bluebird');

        // Let's do promises
        request.Request.prototype.exec = function () {
            var req = this;
            return new BB(function (resolve, reject) {
                req.end(function (er, res) {
                    if (er) {
                        reject(er);
                    } else {
                        resolve(res);
                    }
                });
            });
        };

        this.model = {
            contentTypes : window.contentTypes,
            showProductTypeList : true,
            showContentTypesSelection : false,
            showAbilityToAddProduct : true,
            showContentTypeTemplate : false,
            
            commerceOptions : window.commerceOptions,
            
            activeContentTypeId : null
        };

        this.toggleAddNewProductType = function() {
            this.model.showContentTypesSelection = true;
            this.model.showProductTypeList = false;
            this.model.showAbilityToAddProduct = false;
        };

        this.selectExistingContentType = function(event) {
            this.model.activeContentTypeId = event.item.contentType;

            this.model.showContentTypesSelection = false;
            
            this.saveThisNewProductContentType();
        };
        
        this.addProductTypeTemplate = function(event) {
            this.model.activeContentTypeId = null;
            
            this.model.showContentTypeTemplate = true;
            this.model.showContentTypesSelection = false;
        };
        
        this.addThisNewTemplateType = function() {
            this.model.customProductTypeName = this.customProductTypeInput.value;
            
            this.saveThisNewProductContentType();
        };
        
        this.cancelContentTypeSelection = function() {
            this.model.showContentTypesSelection = false;
            this.model.showAbilityToAddProduct = true;
            this.model.showProductTypeList = true;
        };
        
        this.saveThisNewProductContentType = function() {
            return request
                .post(path.normalize(path.join(window.gh.configs.apiEndpoint, window.gh.configs.base, 'commerce/options/add-commerce-product')))
                .send({ 
                    id : this.model.activeContentTypeId,
                    name : this.model.customProductTypeName
                })
                .set('Authorization', window.gh.localStorage.get('authToken'))
                .exec()
                .then(function(res) {
                    this.model.commerceOptions = res.body;
                    this.model.showContentTypesSelection = false;
                    this.model.addProductTypeTemplate = false;
                    this.model.showAbilityToAddProduct = true;
                    this.model.showProductTypeList = true;
                    this.update();
                }.bind(this))
                .catch(function() {
                    debugger;
                });
        };