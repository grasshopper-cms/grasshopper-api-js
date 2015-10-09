'use strict';

var BB = require('bluebird'),
    //execSync = require('child_process').execSync,
    env = require('./config/environment')(),
    grasshopper = require('../lib/grasshopper-api'),
    _ = require('lodash'),
    running = false;

module.exports = start;

function start() {

    return new BB(function(resolve, reject) {
        // TODO: create way of stopping gh - or having inti call system/db start again
        if (running) {
            resolve(grasshopper);
        } else {
            grasshopper = grasshopper(env);

            grasshopper.core.event.channel('/system/*').on('error', function(payload, next){
                console.log('grasshopper error:', payload);
                next();
                reject();
            });

            grasshopper.core.event.channel('/system/db').on('start', function(payload, next) {
                running = true;
                next();
                resolve(grasshopper);
            });
        }
    });
}
