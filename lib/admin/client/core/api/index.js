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
        activate : activatePlugin,
        deactivate : deactivatePlugin
    },
    menuTabs : {
        list : getTabsList,
        activate : activateTab,
        deactivate : deactivateTab
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
    log.write('Api - Activating Plugin - '+ JSON.stringify(pluginIdToActivate));
    return request
        .post('/api/admin/settings/plugins/activate')
        .set('Authorization', LocalStorage.get('authToken'))
        .send({ 'id' : pluginIdToActivate })
        .exec()
        .then(function(res) {
            return res.body;
        })
        .catch(function(err) {
            log.write('FAILED TO ACTIVATE PLUGIN - '+ err);
            return err;
        });
}

function deactivatePlugin(pluginIdToActivate) {
    log.write('Api - Deactivating Plugin - '+ JSON.stringify(pluginIdToActivate));
    return request
        .post('/api/admin/settings/plugins/deactivate')
        .set('Authorization', LocalStorage.get('authToken'))
        .send({ 'id' : pluginIdToActivate })
        .exec()
        .then(function(res) {
            return res.body;
        })
        .catch(function(err) {
            log.write('FAILED TO DEACTIVATE PLUGIN - '+ err);
            return err;
        });
}

function getTabsList() {
    log.write('Api - Getting Menu Items List');
    return request
        .get('/api/admin/settings/tabs')
        .set('Authorization', LocalStorage.get('authToken'))
        .exec()
        .then(function(res) {
            return res.body;
        })
        .catch(function(err) {
            log.write('FAILED TO GET TABS LIST - '+ err);
            return err;
        });
}

function activateTab(tabId) {
    log.write('Api - Activating Tab - '+ JSON.stringify(tabId));
    return request
        .post('/api/admin/settings/tabs/activate')
        .set('Authorization', LocalStorage.get('authToken'))
        .send({ 'id' : tabId })
        .exec()
        .then(function(res) {
            return res.body;
        })
        .catch(function(err) {
            log.write('FAILED TO ACTIVATE TAB - '+ err);
            return err;
        });
}

function deactivateTab(tabId) {
    log.write('Api - Deactivating Tab - '+ JSON.stringify(tabId));
    return request
        .post('/api/admin/settings/tabs/deactivate')
        .set('Authorization', LocalStorage.get('authToken'))
        .send({ 'id' : tabId })
        .exec()
        .then(function(res) {
            return res.body;
        })
        .catch(function(err) {
            log.write('FAILED TO DEACTIVATE TAB - '+ err);
            return err;
        });
}