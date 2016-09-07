define(['./utilities/localStorage', './utilities/validation', './utilities/cleanCollection',
    './utilities/browserTitles', './utilities/text', './utilities/cookies'],
    function(localStorage, validation, cleanCollection, browserTitles, text, cookies) {
    'use strict';
    return {
        localStorage : localStorage,
        validation : validation,
        cleanCollection : cleanCollection,
        browserTitles : browserTitles,
        text : text,
        cookies : cookies
    };
});
