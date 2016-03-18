define([], function () {
    'use strict';

    return {
        canShow : collectionHasLength
    };

    function collectionHasLength(collection) {
        return (collection.length ? true : false);
    }
});
