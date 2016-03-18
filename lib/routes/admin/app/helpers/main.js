define(['./utilities/localStorage', './utilities/validation', './utilities/cleanCollection',
    './utilities/browserTitles', './utilities/text'],
    function(localStorage, validation, cleanCollection, browserTitles, text) {
    'use strict';
    return {
        localStorage : localStorage,
        validation : validation,
        cleanCollection : cleanCollection,
        browserTitles : browserTitles,
        text : text
    };
});
