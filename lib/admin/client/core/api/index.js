'use strict';

// TODO: qwest might not be a great lib
const request = require('superagent');
const LocalStorage = require('../util/localstorage');
const log = require('../util/log');
const BB = require('bluebird');

// Let's do promises
request.Request.prototype.exec = function () {
    var req = this;
    return new BB(function (resolve, reject) {
        req.end(function (er, res) {
            console.log('er', er, 'res', res);
            if (er) {
                reject(er);
            } else {
                resolve(res);
            }
        });
    });
};


module.exports = {
    user : {
        me : getUser
    },
    plugins : {
        activate : activatePlugin
    }
};

function getUser() {
    log.write('Api - Getting User');
    return request
        .get('/api/user')
        .set('Authorization', LocalStorage.get('authToken'))
        .exec()
        .then(function(res) {
            return res.body;
        })
        .catch(function() {
            window.location = '/admin/login';
        });
}

function activatePlugin(pluginIdToActivate) {
    log.write('Api - Activating / Deactivating Plugin - '+ JSON.stringify(pluginIdToActivate));
    return request
        .post('/api/admin/settings/plugins')
        .set('Authorization', LocalStorage.get('authToken'))
        .send({ 'id' : pluginIdToActivate })
        .exec()
        .then(function(res) {
            return res.body;
        })
        .catch(function(err) {
            console.log('NO DAWG!!!');
            return err;
        });
}