'use strict';

var _localStorage = window.localStorage,
    _existenceCheckInterval = 10,
    BB = require('bluebird');

/**
 * A simple wrapper for local storage.
 */
module.exports = {
    get : get,
    set : set,
    remove : remove
};

function get (name) {
    return _localStorage.getItem(name);
}

function set (name, value) {
    return _localStorage.setItem(name, value);
}

/**
 * Will remove the item from local storage, and return a promise that is resolved when the item can no longer be
 * seen in LocalStorage
 * @param name
 * @returns {promise}
 */
function remove (name) {
    return new BB(function(resolve) {
        _localStorage.removeItem(name);
        _checkForExistence(name, resolve);
    });
}

function _checkForExistence (name, resolve) {
        if (null === _localStorage.getItem(name)) {
            resolve();
        } else {
            setTimeout(function () {
                _checkForExistence(name, resolve);
            }, _existenceCheckInterval);
        }
}