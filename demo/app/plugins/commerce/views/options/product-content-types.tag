product-content-types
    h3(show='{ model.showProductTypeList }') Active Product Types
    .columns(show='{ model.showProductTypeList }')
        virtual(each='{ product in model.commerceOptions.fields.products }')
            .column.one-half { product.title }
            .column.one-half 
                button.btn.right(type='button') Edit
                
        .column.four-fifths.centered.blankslate(unless='model.commerceOptions.fields.products.length')
            h3 No Active Product Types. 
            p Add one below.
    .add-product-type(show='{ model.showAbilityToAddProduct }')
        button.btn.right(type='button' onclick='{ toggleAddNewProductType }') Add Product Type

    .content-types-selection-container(show='{ model.showContentTypesSelection }')
        h3 Select Content Type
        .columns.possible-content-type(each='{ contentType in model.contentTypes }')
            .column.four-fifths { contentType.label }
            .column.one-fifth 
                button.btn.right(type='button' onclick='{ selectThisContentType }') Select
        button.btn.btn-danger.right(type='button' onclick='{ cancelContentTypeSelection }') Cancel

    .content-type-keypath-configuration-container(show='{ model.showContentTypeKeyPathConfiguration }')
        h3 Configure Content Type : { model.activeContentType.label }
        .columns
            .column.one-half Title Keypath :
            .column.one-half
                content-type-keypath-select(content-type='{ model.activeContentType }')
        .columns
            .column.one-half Price Keypath :
            .column.one-half
                content-type-keypath-select(content-type='{ model.activeContentType }')
        .columns
            .column.one-half Sku Keypath :
            .column.one-half
                content-type-keypath-select(content-type='{ model.activeContentType }')
        button.btn.btn-danger.right(type='button' onclick='{ cancelContentTypeSelection }') Cancel
        button.btn.right(type='button' onclick='{ saveThisNewProductContentType }') SAVE

    script.
        // TODO: qwest might not be a great lib
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
            showContentTypeKeyPathConfiguration : false,
            commerceOptions : window.commerceOptions
        };

        this.toggleAddNewProductType = function() {
            this.model.showContentTypesSelection = true;
            this.model.showProductTypeList = false;
            this.model.showContentTypeKeyPathConfiguration = false;
            this.model.showAbilityToAddProduct = false;
        };

        this.selectThisContentType = function(event) {
            this.model.activeContentType = event.item.contentType;

            this.model.showContentTypesSelection = false;
            this.model.showContentTypeKeyPathConfiguration = true;
        };
        
        this.cancelContentTypeSelection = function() {
            this.model.showContentTypesSelection = false;
            this.model.showContentTypeKeyPathConfiguration = false;
            this.model.showAbilityToAddProduct = true;
            this.model.showProductTypeList = true;
        };
        
        this.saveThisNewProductContentType = function() {
            return request
                .post(path.normalize(path.join(window.gh.configs.apiEndpoint, window.gh.configs.base, 'commerce/options/add-commerce-product')))
                .send({ 
                    id : this.model.activeContentType._id,
                    keyPaths : []
                })
                .set('Authorization', window.gh.localStorage.get('authToken'))
                .exec()
                .then(function(res) {
                    this.model.commerceOptions = res.body;
                    this.model.showContentTypesSelection = false;
                    this.model.showContentTypeKeyPathConfiguration = false;
                    this.model.showAbilityToAddProduct = true;
                    this.model.showProductTypeList = true;
                    this.update();
                }.bind(this))
                .catch(function() {
                    debugger;
                });
        };