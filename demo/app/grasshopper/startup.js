'use strict';

const api = require('../../../lib/grasshopper-api');
const BB = require('bluebird');
const configs = require('expressively').configs;
const path = require('path');

// This could technically be a const, but conceptually is a var
var ghInstance = require('./instance');

module.exports = function start() {
    configs.grasshopper.projectRootPath = path.join(__dirname, '..');
    const apiInitializationResults = api(configs.grasshopper);

    ghInstance.admin = apiInitializationResults.admin;
    ghInstance.bridgetown = apiInitializationResults.bridgetown;
    ghInstance.core = apiInitializationResults.core;
    ghInstance.router = apiInitializationResults.router;
    ghInstance.waitFor = new BB(function(resolve, reject) {

        console.log('!!! about to start gh');
        ghInstance
            .core.event.channel('/system/db')
            .on('start', function(payload, next) {
                console.log('starting grasshopper');
                ghInstance
                    .core.auth('basic', {
                    username : configs.grasshopperAdminUsername, password : configs.grasshopperAdminPassword
                })
                    .then(function (token) {
                        console.log('grasshopper authenticated');
                        ghInstance.request = ghInstance.core.request(token);
                        resolve();
                        next();
                    })
                    .catch(reject);
            });

        ghInstance
            .core.event.channel('/type/*')
            .on('save', function(kontx, next) {
                next();
            });

        ghInstance
            .core.event.channel('/content/*')
            .on('save', function(kontx, next) {
                next();
            });
    });
};
