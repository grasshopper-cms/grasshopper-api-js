module.exports = function(grunt) {

    'use strict';

    var lineEnding = '\n',
        _ = require('underscore');

    grunt.initConfig({
        portToUse : 3000,
        pm2pid : 0,
        pkg: grunt.file.readJSON('package.json'),
        heroku: {
            options:{}
        },
        mongodb : {
            test: {
                host: 'mongodb://localhost:27017/test',
                collections: ['users','contenttypes','nodes','content', 'tokens'],
                data: './fixtures/mongodb/test.js'
            },
            seed: {
                host: 'mongodb://localhost:27017/grasshopper',
                collections: ['users','contenttypes','tokens'],
                data: './fixtures/mongodb/test.js'
            },
            dev : {
                host: 'mongodb://localhost:27017/grasshopper',
                collections: ['users','contenttypes','nodes','content', 'tokens'],
                data: './fixtures/mongodb/dev.js'
            },
            heroku: {
                host: '',
                collections: ['users','contenttypes','nodes','content', 'tokens'],
                data: './fixtures/mongodb/test.js'
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            setup: {
                tasks : ['shell:stopServer', 'generatePublicTest', 'mongodb:test', 'shell:stopTestServer']
            },
            test: {
                tasks : ['shell:startTestServer', 'startTestWithDelay:2500']
            }
        },
        shell : {
            options : {
                stdout : true,
                stderr : true
            },
            makeTest : {
                command: 'mocha --colors -R Spec <%= test %>',
                options: {
                    stdout: true,
                    stderr: true
                },
                callback : function(err, stdout, stderr, cb) {
                    grunt.task.run(['deletePublicTest','shell:stopTestServer', 'exitTests']);
                    cb();
                }
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
        },
        nodemon: {
            dev: {
                options: {
                    file: 'bin/grasshopper-api.js',
                    ignoredFiles: ['README.md', 'node_modules/**', 'Gruntfile.js','*.log', '*.xml'],
                    legacyWatch: true,
                    env: {
                        PORT: '3000'
                    },
                    cwd: __dirname
                }
            },
            test: {
                options: {
                    file: 'bin/grasshopper-api.js',
                    args: ['test'],
                    ignoredFiles: ['README.md', 'node_modules/**', 'Gruntfile.js','*.log', '*.xml'],
                    legacyWatch: true,
                    env: {
                        PORT: '3000'
                    },
                    cwd: __dirname
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        releaseNotes : {
            main : {
                src : 'templates/README.template.md',
                dest : 'README.md',
                baseLinkPath : 'https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/',
            }
        }
    });

    grunt.registerTask('readme', 'create README.md from template', function() {

        grunt.config.set('warning', 'Compiled file. Do not modify directly.');
        grunt.task.run(['shell:shortlog', 'releaseNotes']);
    });

    grunt.registerTask('startTestWithDelay', function(delay) {
        var done = this.async();
        setTimeout(function() {
            grunt.task.run(['shell:makeTest']);
            done();
        }, delay);
    });

    grunt.registerTask('exitTests', function() {
        grunt.fail.fatal("Shutting down... tests are done.");
    });

    grunt.loadTasks('tasks');
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('dev',['nodemon:dev']);
    grunt.registerTask('test', ['concurrent:setup', 'concurrent:test']);

    grunt.registerTask('seedDev', ['mongodb:dev']);
    grunt.registerTask('heroku:db:seed', 'Task that will seed the heroku test database.', function () {
        grunt.task.run("shell:getHerokuDbConnection");
    });

    grunt.registerTask('server:start', ['shell:startServer']);
    grunt.registerTask('server:stop', ['shell:stopServer']);
    grunt.registerTask('server:restart', ['shell:restartServer']);
    grunt.registerTask('seedServer', ['shell:stopServer', 'mongodb:seed', 'shell:startSeedServer']);
    grunt.registerTask('default', ['jshint']);

    grunt.config.set('warning', 'Compiled file. Do not modify directly.');
    grunt.registerTask('readme', ['shell:shortlog', 'releaseNotes']);
};
