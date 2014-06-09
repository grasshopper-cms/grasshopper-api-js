'use strict';

var lineEnding = '\n',
    _ = require('underscore');

module.exports = function(grunt) {

    grunt.config('shell', {
        options : {
            stdout : true,
            stderr : true
        },
        makeTest : {
            command: 'mocha --colors -R spec <%= test %>',
            options: {
                stdout: true,
                stderr: true
            },
            callback : function(err, stdout, stderr, cb) {
                grunt.task.run(['deletePublicTest','shell:stopTestServer', 'exitTests']);
                cb();
            }
        },
        testSetup : {
            command: "./tasks/importdb.sh"
        },
        testRun : {
            command: "mocha --reporter spec --recursive"
        },
        startTestServer: {
            command: "node bin/grasshopper-api test"
        },
        startSeedServer: {
            command: "node bin/grasshopper-api grasshopper"
        },
        stopTestServer: {
            command: "tasks/killserver.sh bin/grasshopper-api"
        },
        startServer: {
            command : "pm2 start bin/grasshopper-api.js -i max -e log/grasshopper.err.log -o log/grasshopper.out.log"
        },
        stopServer : {
            command : "pm2 kill all"
        },
        restartServer : {
            command : "pm2 restart all"
        },
        'getHerokuDbConnection' : {
            options : {
                stderr : true,
                stdout : false,
                failOnError : true,
                callback : function(err, stdout, stderr, cb) {
                    grunt.config.data.mongodb.heroku.host = stdout.split(lineEnding)[0];
                    grunt.task.run("mongodb:heroku");
                    setTimeout(function(){
                        cb();
                    },1);

                }
            },
            command : 'heroku config:get MONGOLAB_URI'
        },
        'shortlog' : {
            options : {
                stderr : true,
                stdout : false,
                failOnError : true,
                callback : function(err, stdout, stderr, cb) {
                    stdout = stdout.split(lineEnding);
                    _.each(stdout, function(line, index) {
                        stdout[index] = line.replace(/^\s*\d+\s+([^\s])/,'* $1');
                    });
                    grunt.config.set('contributors', stdout.join(lineEnding));
                    cb();
                }
            },
            command : 'git --no-pager shortlog -ns HEAD'
        }
    });
};