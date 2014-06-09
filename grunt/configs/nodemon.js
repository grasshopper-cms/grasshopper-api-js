'use strict';
var sep = require('path').sep;
module.exports = function(grunt) {

    grunt.config('nodemon',  {
        dev: {
            options: {
                file: 'bin/grasshopper-api.js',
                ignoredFiles: ['README.md', 'node_modules/**', 'Gruntfile.js','*.log', '*.xml'],
                legacyWatch: true,
                env: {
                    PORT: '3000'
                },
                cwd: '..' + sep + '..' + sep + __dirname
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
                cwd: '..' + sep + '..' + sep + __dirname
            }
        }
    });
};