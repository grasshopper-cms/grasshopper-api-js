'use strict';

var commerceSingleton = require('../../commerceSingleton'),
    BB = require('bluebird'),
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
        keyPaths = request.body.keyPaths;

    if(!contentTypeIdInQuestion) {
        new commerceSingleton.grasshopper.bridgetown.Response(response).writeError({ message : 'You must send a contentType ID.', code : 400 });
    } else if(!keyPaths) {
        new commerceSingleton.grasshopper.bridgetown.Response(response).writeError({ message : 'You must send pertinant keyPaths.', code : 400 });
    } else {
        BB.join(_getCommerceOptionsContent(), _getContentTypeFromDb(commerceSingleton.commerceOptionsTypeId), function(commerceOptionsContent, contentTypeFromDb) {
                console.log(commerceOptionsContent.fields.products);
                var products = commerceOptionsContent.fields.products
                        .filter(function(product) {
                            return product.typeId !== contentTypeIdInQuestion;
                        });

                products.push({
                    typeId : contentTypeIdInQuestion,
                    title : contentTypeFromDb.label,
                    keypaths : keyPaths
                });

                return commerceSingleton.grasshopper
                    .request
                    .content
                    .update(defaultsDeep({
                        fields : {
                            products : products
                        }
                    }, commerceOptionsContent));
            })
            .then(function(latest) {
                new commerceSingleton.grasshopper.bridgetown.Response(response).writeSuccess(latest);
            })
            .catch(function(err) {
                console.log(err);
                new commerceSingleton.grasshopper.bridgetown.Response(response).writeError({ message : 'Error Updating Commerce Products', code : 400 });
            });
    }
}

function _getCommerceOptionsContent() {
    return commerceSingleton.grasshopper
        .request
        .content
        .getById(commerceSingleton.commerceOptionsContentId);
}

function _getContentTypeFromDb(commerceOptionsTypeId) {
    return commerceSingleton.grasshopper
        .request
        .contentTypes
        .list() // Cannot query content types yet.
        .then(function(queryResults) {
            var found = queryResults
                .results
                .find(function(contentType) {
                    return contentType._id.toString() === commerceOptionsTypeId;
                });

            return found;
        });
}
