'use strict';

var commerceSingleton = require('../../commerceSingleton'),
    commerceContentTypes = require('../../commerceContentTypes'),
    defaultsDeep = require('lodash/defaultsDeep');

module.exports = {
    addCommerceProduct : [
        commerceSingleton.grasshopper.bridgetown.middleware.authorization,
        commerceSingleton.grasshopper.bridgetown.middleware.authToken,
        function(request, response, next) {
            if(request.bridgetown.identity.role === 'admin') {
                next();
            } else {
                new commerceSingleton.grasshopper.bridgetown.Response(response).writeUnauthorized();
            }
        },
        _handleAddCommerceProduct
    ]
};

function _handleAddCommerceProduct(request, response) {
    var contentTypeIdInQuestion = request.body.id,
        contantTypeName = request.body.name;

    if(!contentTypeIdInQuestion && !contantTypeName) {
        new commerceSingleton.grasshopper.bridgetown.Response(response).writeError({ message : 'You must send a contentType ID or a name for a new template type.', code : 400 });
    } else {
        if(!contentTypeIdInQuestion) {
            // Going to add a new one.
            _addNewProductTemplate(contantTypeName)
                .then(function(addedProductTypeId) {
                    return _updateCommerceOptions(addedProductTypeId);
                })
                .then(function(latest) {
                    new commerceSingleton.grasshopper.bridgetown.Response(response).writeSuccess(latest);
                })
                .catch(function(err) {
                    console.log(err);
                    new commerceSingleton.grasshopper.bridgetown.Response(response).writeError({ message : 'Error Updating Commerce Products', code : 400 });
                });
        } else {
            _updateCommerceOptions(contentTypeIdInQuestion)
                .then(function(latest) {
                    new commerceSingleton.grasshopper.bridgetown.Response(response).writeSuccess(latest);
                })
                .catch(function(err) {
                    console.log(err);
                    new commerceSingleton.grasshopper.bridgetown.Response(response).writeError({ message : 'Error Updating Commerce Products', code : 400 });
                });
        }
    }
}

function _addNewProductTemplate(name) {
    commerceContentTypes.productContentTypeTemplate.label = name;

    return commerceSingleton.grasshopper
        .request
        .contentTypes
        .insert(commerceContentTypes.productContentTypeTemplate)
        .then(function(newContentType) {
            return newContentType._id.toString();
        });
}

function _updateCommerceOptions(contentTypeIdInQuestion) {
    return _getCommerceOptionsContent()
        .then(function(commerceOptionsContent) {
            var products = commerceOptionsContent.fields.products
                    .filter(function(product) {
                        return product !== contentTypeIdInQuestion;
                    });

            products.push(contentTypeIdInQuestion);

            return commerceSingleton.grasshopper
                .request
                .content
                .update(defaultsDeep({
                    fields : {
                        products : products
                    }
                }, commerceOptionsContent));
        });
}

function _getCommerceOptionsContent() {
    return commerceSingleton.grasshopper
        .request
        .content
        .getById(commerceSingleton.commerceOptionsContentId);
}
