module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mongodb : {
            test: {
                host: 'mongodb://localhost:27017/test',
                collections: ['users','contentTypes','nodes','content', 'tokens']
            }
        },
        concurrent: {
            test: {
                tasks: ['mongodb:test', 'shell:stopTestServer', 'shell:startTestServer'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        shell : {
            startTestServer: {
                command: "node lib/grasshopper-api test",
                options : {
                    stdout : true,
                    stderr : true
                }
            },
            stopTestServer: {
                command: "tasks/killserver.sh lib/grasshopper-api",
                options : {
                    stdout : true,
                    stderr : true
                }
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

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('dev',['nodemon:dev']);
    grunt.registerTask('test', ['concurrent:test']);

    grunt.registerTask('default', ['jshint']);

};