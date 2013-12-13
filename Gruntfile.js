module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mongodb : {
            test: {
                host: 'mongodb://localhost:27017/test',
                collections: ['users','contenttypes','nodes','content', 'tokens'],
                data: './fixtures/mongodb/test.js'
            },
            dev : {
                host: 'mongodb://localhost:27017/grasshopper',
                collections: ['users','contenttypes','nodes','content', 'tokens'],
                data: './fixtures/mongodb/dev.js'
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            setup: {
                tasks : ['generatePublicTest', 'mongodb:test', 'shell:stopTestServer'],
            },
            test: {
                tasks : ['shell:startTestServer', 'startTestWithDelay:1000'],
            }
        },
        shell : {
            options : {
                stdout : true,
                stderr : true
            },
            makeTest : {
                command : "make test",
                options : {
                    callback : function(err, stdout, stderr, cb) {
                        grunt.task.run(['deletePublicTest','shell:stopTestServer']);
                        grunt.fail.fatal("Shutting down... tests are done.")
                        cb();
                    }
                }
            },
            startTestServer: {
                command: "node lib/grasshopper-api test",
            },
            stopTestServer: {
                command: "tasks/killserver.sh lib/grasshopper-api",
            },
            startServer: {
                command : "pm2 start lib/grasshopper-api.js -i max -e log/grasshopper.err.log -o log/grasshopper.out.log",
            },
            stopServer : {
                command : "pm2 stop all",
            },
            restartServer : {
                command : "pm2 restart all",
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'lib/grasshopper-api.js',
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
                    file: 'lib/grasshopper-api.js',
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
        }
    });

    grunt.registerTask('startTestWithDelay', function(delay) {
        var done = this.async();
        setTimeout(function() {
            grunt.task.run(['shell:makeTest']);
            done();
        }, delay);
    });

    grunt.loadTasks('tasks');
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('dev',['nodemon:dev']);
    grunt.registerTask('test', ['concurrent:setup', 'concurrent:test']);

    grunt.registerTask('seedDev', ['mongodb:dev']);

    grunt.registerTask('server:start', ['shell:startServer']);
    grunt.registerTask('server:stop', ['shell:stopServer']);
    grunt.registerTask('server:restart', ['shell:restartServer']);

    grunt.registerTask('default', ['jshint']);

};