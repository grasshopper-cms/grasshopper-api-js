'use strict';

var lineEnding = '\n',
    _ = require('lodash');

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
                stderr: true,
                failOnError: true,
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
            options : {
                failOnError: true
            },
            command: "mocha --reporter spec --recursive"
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